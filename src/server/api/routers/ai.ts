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
import { sql } from "@payloadcms/db-postgres";
import type { Condition } from "~/payload/payload-types";
import type { AugmentedPracticalGuide } from "./practical-guides";
import type { AugmentedCourse } from "./courses";

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

			// 1. Retrieve relevant text chunks from search vectors
			const embedding = await generateEmbedding(userMessage);
			const [retrieveGuideEmbeddings, retrieveCourseEmbeddings] = await Promise.all([
				ctx.payload.db.drizzle.execute(sql`
					SELECT doc_id, text, embedding <=> ${JSON.stringify(embedding)}::vector as similarity_score
					FROM practical_guide_search_vectors
					ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
					LIMIT 3
				`),
				ctx.payload.db.drizzle.execute(sql`
					SELECT doc_id, text, embedding <=> ${JSON.stringify(embedding)}::vector as similarity_score
					FROM courses_search_vectors
					ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
					LIMIT 3
				`),
			]);

			// 2. Fetch practical guide docs and course docs
			const [practicalGuides, courses] = await Promise.all([
				ctx.payload.find({
					collection: "practical-guides",
					where: {
						id: {
							in: retrieveGuideEmbeddings.rows.map(({ doc_id }) => doc_id),
						},
					},
					depth: 1,
				}),
				ctx.payload.find({
					collection: "courses",
					where: {
						id: {
							in: retrieveCourseEmbeddings.rows.map(({ doc_id }) => doc_id),
						},
					},
					depth: 1,
				}),
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

			// 3. Build context from retrieved chunks
			const guideChunks = (
				retrieveGuideEmbeddings.rows as {
					doc_id: string;
					text: string;
					similarity_score: number;
				}[]
			)
				.map(({ text }) => text)
				.join("\n\n---\n\n");

			const courseChunks = (
				retrieveCourseEmbeddings.rows as {
					doc_id: string;
					text: string;
					similarity_score: number;
				}[]
			)
				.map(({ text }) => text)
				.join("\n\n---\n\n");

			const contextChunks = [guideChunks, courseChunks]
				.filter(Boolean)
				.join("\n\n---\n\n");

			// 4. Load the direct chatbot system prompt
			let systemPrompt = "";
			try {
				systemPrompt = readFileSync(
					path.join(
						process.cwd(),
						"src/utils/prompts/chatbot-direct.md",
					),
					"utf-8",
				);
			} catch (_) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to load system prompt",
				});
			}

			// 5. Call Albert with user question + retrieved chunks as context
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
			};
		}),

});
