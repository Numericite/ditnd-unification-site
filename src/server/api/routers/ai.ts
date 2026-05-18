import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	resolveRelations,
} from "~/server/api/trpc";
import { readFileSync } from "node:fs";
import path from "node:path";
import { generateEmbedding } from "~/payload/services/embedding";
import { rerankCandidates } from "~/payload/services/rerank";
import { sql } from "@payloadcms/db-postgres";
import type { Condition } from "~/payload/payload-types";
import type { AugmentedPracticalGuide } from "./practical-guides";
import type { AugmentedCourse } from "./courses";

// RAG tuning constants.
// Retrieve a wide candidate set per source via ANN, then rerank to keep only the most relevant.
const ANN_CANDIDATES_PER_SOURCE = 12;
const RERANK_TOP_K = 5;
// Fallback (no rerank): keep the previous behavior of top-3 from each source.
const FALLBACK_TOP_K_PER_SOURCE = 3;

type Source = "guides" | "courses";

type VectorRow = {
	doc_id: string;
	text: string;
	similarity_score: number;
};

type RetrievedChunk = {
	docId: string;
	source: Source;
	text: string;
	similarityScore: number;
};

export const aiRouter = createTRPCRouter({
	chatbotDirectSend: publicProcedure
		.input(z.object({ userMessage: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { userMessage } = input;

			const apiKey = process.env.ALBERT_API_KEY;
			const apiUrl = process.env.ALBERT_API_URL;

			if (!apiKey || !apiUrl) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "ALBERT_API_KEY or ALBERT_API_URL not configured",
				});
			}

			// 1. Embed the user question with bge-m3.
			const embedding = await generateEmbedding(userMessage);
			const embeddingJson = JSON.stringify(embedding);

			// 2. Pull a wide candidate set from both vector tables (ANN recall).
			const [retrieveGuideEmbeddings, retrieveCourseEmbeddings] =
				await Promise.all([
					ctx.payload.db.drizzle.execute(sql`
						SELECT doc_id, text, embedding <=> ${embeddingJson}::vector as similarity_score
						FROM practical_guide_search_vectors
						ORDER BY embedding <=> ${embeddingJson}::vector
						LIMIT ${ANN_CANDIDATES_PER_SOURCE}
					`),
					ctx.payload.db.drizzle.execute(sql`
						SELECT doc_id, text, embedding <=> ${embeddingJson}::vector as similarity_score
						FROM courses_search_vectors
						ORDER BY embedding <=> ${embeddingJson}::vector
						LIMIT ${ANN_CANDIDATES_PER_SOURCE}
					`),
				]);

			const guideCandidates: RetrievedChunk[] = (
				retrieveGuideEmbeddings.rows as VectorRow[]
			).map((row) => ({
				docId: row.doc_id,
				source: "guides",
				text: row.text,
				similarityScore: row.similarity_score,
			}));
			const courseCandidates: RetrievedChunk[] = (
				retrieveCourseEmbeddings.rows as VectorRow[]
			).map((row) => ({
				docId: row.doc_id,
				source: "courses",
				text: row.text,
				similarityScore: row.similarity_score,
			}));

			// 3. Rerank the merged candidate pool with bge-reranker-v2-m3.
			//    On failure, fall back to cosine-sorted top-N from each source so the chatbot keeps working.
			const mergedCandidates = [...guideCandidates, ...courseCandidates];

			let selectedChunks: RetrievedChunk[];
			let primarySource: Source;

			if (mergedCandidates.length === 0) {
				selectedChunks = [];
				primarySource = "guides";
			} else {
				try {
					const reranked = await rerankCandidates(
						userMessage,
						mergedCandidates.map((c) => ({
							id: `${c.source}:${c.docId}`,
							text: c.text,
							meta: c,
						})),
					);
					selectedChunks = reranked
						.slice(0, RERANK_TOP_K)
						.map((r) => r.meta as RetrievedChunk);

					// The reranker's top hit defines the primary source.
					const topHit = reranked[0]?.meta as RetrievedChunk | undefined;
					primarySource = topHit?.source ?? "guides";
				} catch (err) {
					console.warn(
						"[RAG] Rerank call failed, falling back to cosine-ranked candidates:",
						err,
					);
					selectedChunks = [
						...guideCandidates.slice(0, FALLBACK_TOP_K_PER_SOURCE),
						...courseCandidates.slice(0, FALLBACK_TOP_K_PER_SOURCE),
					];
					// Lower cosine distance = more similar.
					const bestGuide = guideCandidates[0]?.similarityScore ?? Infinity;
					const bestCourse = courseCandidates[0]?.similarityScore ?? Infinity;
					primarySource = bestCourse < bestGuide ? "courses" : "guides";
				}
			}

			// 4. Fetch the underlying Payload documents only for IDs that survived ranking.
			const surfacedGuideIds = Array.from(
				new Set(
					selectedChunks
						.filter((c) => c.source === "guides")
						.map((c) => c.docId),
				),
			);
			const surfacedCourseIds = Array.from(
				new Set(
					selectedChunks
						.filter((c) => c.source === "courses")
						.map((c) => c.docId),
				),
			);

			const [practicalGuides, courses] = await Promise.all([
				surfacedGuideIds.length > 0
					? ctx.payload.find({
							collection: "practical-guides",
							where: { id: { in: surfacedGuideIds } },
							depth: 1,
						})
					: Promise.resolve({ docs: [] }),
				surfacedCourseIds.length > 0
					? ctx.payload.find({
							collection: "courses",
							where: { id: { in: surfacedCourseIds } },
							depth: 1,
						})
					: Promise.resolve({ docs: [] }),
			]);

			const tmpPracticalGuides = (await Promise.all(
				practicalGuides.docs.map(async (doc) => ({
					...doc,
					conditions: await resolveRelations(
						doc.conditions as (number | Condition)[],
						"conditions",
					),
					themes: await resolveRelations(doc.themes, "themes"),
				})),
			)) as AugmentedPracticalGuide[];

			const tmpCourses = courses.docs as AugmentedCourse[];

			// 5. Build the LLM context. Tag each chunk by source so the model can disambiguate.
			const contextChunks = selectedChunks
				.map((c) => {
					const label = c.source === "guides" ? "Fiche pratique" : "Formation";
					return `[Source: ${label}]\n${c.text}`;
				})
				.join("\n\n---\n\n");

			// 6. Load the chatbot system prompt.
			let systemPrompt = "";
			try {
				systemPrompt = readFileSync(
					path.join(process.cwd(), "src/utils/prompts/chatbot-direct.md"),
					"utf-8",
				);
			} catch (_) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to load system prompt",
				});
			}

			// 7. Generate the answer with Albert.
			const albertPayload = {
				model: "albert-large",
				messages: [
					{ role: "system", content: systemPrompt },
					{
						role: "user",
						content: `Question : ${userMessage}\n\nInformations issues des guides pratiques et formations :\n\n${contextChunks}`,
					},
				],
				temperature: 0.1,
				response_format: { type: "json_object" },
				max_completion_tokens: 800,
			};

			const response = await fetch(`${apiUrl}/v1/chat/completions`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(albertPayload),
			});

			if (!response.ok) {
				console.error("Albert API error response:", await response.text());
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Error from Albert API: ${response.statusText}`,
				});
			}

			const data = (await response.json()) as { id: string; choices: any[] };

			const parsed = z
				.object({ content: z.string() })
				.safeParse(JSON.parse(data.choices[0].message.content));

			if (!parsed.data) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Invalid response format from Albert API",
				});
			}

			return {
				content: parsed.data.content,
				guides: tmpPracticalGuides,
				courses: tmpCourses,
				primarySource,
			};
		}),
});
