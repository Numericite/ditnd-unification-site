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
import { expandQuery } from "~/payload/services/queryExpansion";
import { rerankCandidates } from "~/payload/services/rerank";
import { sql } from "@payloadcms/db-postgres";
import type { Condition } from "~/payload/payload-types";
import type { AugmentedPracticalGuide } from "./practical-guides";
import type { AugmentedCourse } from "./courses";

// RAG tuning constants.
// Pull a wide candidate set per source via ANN, then rerank with a cross-encoder.
const ANN_CANDIDATES_PER_SOURCE = 12;
// Hard cap on chunks fed to the LLM after reranking.
const RERANK_TOP_K = 5;
// Albert's bge-reranker-v2-m3 returns sigmoid-style scores in [0, 1].
// With query expansion, real scores cleanly tier: direct hits >= 0.5, related >= 0.2,
// noise < 0.05. 0.1 is the "quality floor": ensures we never surface weakly-related items
// even when the query is mediocre, and yields an empty context (LLM says "no info") when
// the corpus genuinely has nothing useful.
const RERANK_MIN_SCORE = 0.1;
// Relative gap: keep a candidate only if its score is at least this fraction of the top score.
// 0.25 keeps anything within ~4× of the best hit — wide enough to surface clearly related
// documents even when the absolute top score is modest.
const RERANK_RELATIVE_GAP = 0.25;
// Fallback (rerank API failed): use cosine top-N per source. Best we can do without a cross-encoder.
const FALLBACK_TOP_K_PER_SOURCE = 3;
// Length of the chunk preview returned in the debug payload (keeps response size sane).
const DEBUG_TEXT_PREVIEW_CHARS = 160;

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

type RerankedChunk = RetrievedChunk & { rerankScore: number };

type DebugCandidate = {
	source: Source;
	docId: string;
	cosineDistance: number;
	textPreview: string;
};

type DebugRerankedRow = {
	source: Source;
	docId: string;
	cosineDistance: number;
	rerankScore: number;
	kept: boolean;
	reason?: string;
	textPreview: string;
};

type DebugInfo = {
	query: string;
	expansion?: { keywords: string; expanded: string };
	expansionError?: string;
	embedding: { model: "BAAI/bge-m3"; dimensions: number };
	annCandidates: { guides: DebugCandidate[]; courses: DebugCandidate[] };
	ragPath: "rerank" | "fallback" | "no-candidates";
	rerank?: {
		topScore: number;
		minScore: number;
		relativeGap: number;
		topK: number;
		rows: DebugRerankedRow[];
	};
	rerankError?: string;
	selectedChunks: {
		source: Source;
		docId: string;
		rerankScore?: number;
		cosineDistance: number;
		textPreview: string;
	}[];
};

function preview(text: string): string {
	if (text.length <= DEBUG_TEXT_PREVIEW_CHARS) return text;
	return `${text.slice(0, DEBUG_TEXT_PREVIEW_CHARS)}…`;
}

// Filter reranked candidates by absolute floor AND relative gap.
// - Drop anything below RERANK_MIN_SCORE (irrelevant).
// - Among survivors, drop anything below topScore * RERANK_RELATIVE_GAP (weakly related compared to the best hit).
// - Cap at RERANK_TOP_K.
function applyRelevanceGate(reranked: RerankedChunk[]): {
	kept: RerankedChunk[];
	dropReasons: Map<string, string>;
} {
	const dropReasons = new Map<string, string>();
	const topChunk = reranked[0];
	if (!topChunk) return { kept: [], dropReasons };

	const topScore = topChunk.rerankScore;
	const relativeFloor =
		topScore > 0 ? topScore * RERANK_RELATIVE_GAP : -Infinity;

	const kept: RerankedChunk[] = [];
	for (const chunk of reranked) {
		const key = `${chunk.source}:${chunk.docId}`;
		if (chunk.rerankScore < RERANK_MIN_SCORE) {
			dropReasons.set(key, `below absolute floor (${RERANK_MIN_SCORE})`);
			continue;
		}
		if (chunk.rerankScore < relativeFloor) {
			dropReasons.set(
				key,
				`below relative floor (${relativeFloor.toFixed(3)} = ${topScore.toFixed(3)} × ${RERANK_RELATIVE_GAP})`,
			);
			continue;
		}
		if (kept.length >= RERANK_TOP_K) {
			dropReasons.set(key, `over top-K cap (${RERANK_TOP_K})`);
			continue;
		}
		kept.push(chunk);
	}
	return { kept, dropReasons };
}

export const aiRouter = createTRPCRouter({
	chatbotDirectSend: publicProcedure
		.input(
			z.object({
				userMessage: z.string(),
				// When true, response includes a `_debug` field exposing ANN scores, rerank scores
				// and the path taken. Useful for tuning. Consider gating to admin if used in prod.
				debug: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { userMessage, debug = false } = input;

			const apiKey = process.env.ALBERT_API_KEY;
			const apiUrl = process.env.ALBERT_API_URL;

			if (!apiKey || !apiUrl) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "ALBERT_API_KEY or ALBERT_API_URL not configured",
				});
			}

			// 1a. Expand the query with formal synonyms via Albert chat to bridge colloquial
			//     French vocabulary to the corpus vocabulary. Used for embedding + reranking,
			//     NOT for the final LLM call (we don't want to alter the user's question).
			//     If expansion fails, fall back to the original query.
			let retrievalQuery = userMessage;
			let expansionDebug: DebugInfo["expansion"];
			let expansionErrorMessage: string | undefined;
			try {
				const { keywords, expanded } = await expandQuery(userMessage);
				retrievalQuery = expanded;
				expansionDebug = { keywords, expanded };
				console.info("[RAG] query expansion", { userMessage, keywords });
			} catch (err) {
				expansionErrorMessage =
					err instanceof Error ? err.message : String(err);
				console.warn(
					"[RAG] Query expansion failed, using original query:",
					expansionErrorMessage,
				);
			}

			// 1b. Embed the (expanded) query with bge-m3.
			const embedding = await generateEmbedding(retrievalQuery);
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

			const mergedCandidates = [...guideCandidates, ...courseCandidates];

			// 3. Rerank with bge-reranker-v2-m3, then apply absolute floor + relative gap.
			//    On failure: log + fallback to cosine top-N per source so the chatbot stays available.
			let selectedChunks: RetrievedChunk[];
			let primarySource: Source;
			let ragPath: DebugInfo["ragPath"];
			let rerankDebug: DebugInfo["rerank"] | undefined;
			let rerankErrorMessage: string | undefined;

			if (mergedCandidates.length === 0) {
				selectedChunks = [];
				primarySource = "guides";
				ragPath = "no-candidates";
			} else {
				try {
					const reranked = await rerankCandidates(
						retrievalQuery,
						mergedCandidates.map((c) => ({
							id: `${c.source}:${c.docId}`,
							text: c.text,
							meta: c,
						})),
					);
					const rerankedChunks: RerankedChunk[] = reranked.map((r) => ({
						...(r.meta as RetrievedChunk),
						rerankScore: r.score,
					}));

					const { kept, dropReasons } = applyRelevanceGate(rerankedChunks);
					selectedChunks = kept;

					const topHit = kept[0];
					primarySource = topHit?.source ?? "guides";
					ragPath = "rerank";

					console.info("[RAG] rerank", {
						query: userMessage,
						topScore: rerankedChunks[0]?.rerankScore,
						kept: kept.map((c) => ({
							source: c.source,
							docId: c.docId,
							rerankScore: c.rerankScore,
						})),
					});

					if (debug) {
						rerankDebug = {
							topScore: rerankedChunks[0]?.rerankScore ?? 0,
							minScore: RERANK_MIN_SCORE,
							relativeGap: RERANK_RELATIVE_GAP,
							topK: RERANK_TOP_K,
							rows: rerankedChunks.map((c) => {
								const key = `${c.source}:${c.docId}`;
								const dropReason = dropReasons.get(key);
								return {
									source: c.source,
									docId: c.docId,
									cosineDistance: c.similarityScore,
									rerankScore: c.rerankScore,
									kept: !dropReason,
									reason: dropReason,
									textPreview: preview(c.text),
								};
							}),
						};
					}
				} catch (err) {
					rerankErrorMessage = err instanceof Error ? err.message : String(err);
					console.warn(
						"[RAG] Rerank call failed, falling back to cosine-ranked candidates:",
						rerankErrorMessage,
					);
					selectedChunks = [
						...guideCandidates.slice(0, FALLBACK_TOP_K_PER_SOURCE),
						...courseCandidates.slice(0, FALLBACK_TOP_K_PER_SOURCE),
					];
					// Lower cosine distance = more similar.
					const bestGuide = guideCandidates[0]?.similarityScore ?? Infinity;
					const bestCourse = courseCandidates[0]?.similarityScore ?? Infinity;
					primarySource = bestCourse < bestGuide ? "courses" : "guides";
					ragPath = "fallback";
				}
			}

			// 4. Fetch underlying Payload documents only for IDs that survived ranking.
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

			// Reorder the surfaced docs to follow the rerank ordering (best hit first).
			const guideOrder = new Map(surfacedGuideIds.map((id, idx) => [id, idx]));
			const courseOrder = new Map(
				surfacedCourseIds.map((id, idx) => [id, idx]),
			);
			tmpPracticalGuides.sort(
				(a, b) =>
					(guideOrder.get(String(a.id)) ?? Number.MAX_SAFE_INTEGER) -
					(guideOrder.get(String(b.id)) ?? Number.MAX_SAFE_INTEGER),
			);
			tmpCourses.sort(
				(a, b) =>
					(courseOrder.get(String(a.id)) ?? Number.MAX_SAFE_INTEGER) -
					(courseOrder.get(String(b.id)) ?? Number.MAX_SAFE_INTEGER),
			);

			// 5. Build the LLM context. Tag each chunk by source so the model can disambiguate.
			//    If no chunks survived the relevance gate, the LLM gets an empty context and should
			//    answer "no info found" per the system prompt.
			const contextChunks =
				selectedChunks.length === 0
					? "(Aucune information pertinente trouvée dans les guides ou formations.)"
					: selectedChunks
							.map((c) => {
								const label =
									c.source === "guides" ? "Fiche pratique" : "Formation";
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

			const baseResult = {
				content: parsed.data.content,
				guides: tmpPracticalGuides,
				courses: tmpCourses,
				primarySource,
			};

			if (!debug) return baseResult;

			const debugInfo: DebugInfo = {
				query: userMessage,
				expansion: expansionDebug,
				expansionError: expansionErrorMessage,
				embedding: {
					model: "BAAI/bge-m3",
					dimensions: embedding.length,
				},
				annCandidates: {
					guides: guideCandidates.map((c) => ({
						source: c.source,
						docId: c.docId,
						cosineDistance: c.similarityScore,
						textPreview: preview(c.text),
					})),
					courses: courseCandidates.map((c) => ({
						source: c.source,
						docId: c.docId,
						cosineDistance: c.similarityScore,
						textPreview: preview(c.text),
					})),
				},
				ragPath,
				rerank: rerankDebug,
				rerankError: rerankErrorMessage,
				selectedChunks: selectedChunks.map((c) => ({
					source: c.source,
					docId: c.docId,
					rerankScore: (c as RerankedChunk).rerankScore,
					cosineDistance: c.similarityScore,
					textPreview: preview(c.text),
				})),
			};

			return { ...baseResult, _debug: debugInfo };
		}),
});
