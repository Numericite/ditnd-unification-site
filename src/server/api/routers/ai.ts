import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	resolveRelations,
} from "~/server/api/trpc";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Payload } from "payload";
import { generateEmbedding } from "~/payload/services/embedding";
import { sql } from "@payloadcms/db-postgres";
import type { Condition } from "~/payload/payload-types";
import type { AugmentedPracticalGuide } from "./practical-guides";

export const messageSchema = z.object({
	role: z.enum(["user", "assistant"]),
	content: z.string(),
	choices: z.array(z.string()).optional(),
	userChoices: z.array(z.string()).optional(),
	useRetrieval: z.boolean().optional(),
});

export type TMessage = z.infer<typeof messageSchema>;

const retrieveDocsFromUserPrompt = async ({
	payload,
	userPrompt,
}: {
	payload: Payload;
	userPrompt: string;
}) => {
	console.log("[RAG] Requête de recherche - userPrompt:", userPrompt);
	const embedding = await generateEmbedding(userPrompt);
	console.log("[RAG] Embedding généré, dimension:", embedding.length);
	const retrieveSqlEmbedding = await payload.db.drizzle.execute(sql`
		SELECT doc_id, text, embedding <=> ${JSON.stringify(embedding)}::vector as similarity_score FROM practical_guide_search_vectors
		ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
		LIMIT 10
	`);

	console.log("[RAG] Résultats SQL - nombre de lignes:", retrieveSqlEmbedding.rows.length);
	console.log("[RAG] Scores de similarité:", retrieveSqlEmbedding.rows.map(({ doc_id, similarity_score }) => ({ doc_id, similarity_score })));
	const practicalGuides = await payload.find({
		collection: "practical-guides",
		where: {
			id: {
				in: retrieveSqlEmbedding.rows.map(({ doc_id }) => doc_id),
			},
		},
		limit: 2,
		depth: 1,
	});

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

	return tmpPracticalGuides;
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

			// 1. Retrieve relevant text chunks from search vectors
			const embedding = await generateEmbedding(userMessage);
			const retrieveSqlEmbedding = await ctx.payload.db.drizzle.execute(sql`
				SELECT doc_id, text, embedding <=> ${JSON.stringify(embedding)}::vector as similarity_score
				FROM practical_guide_search_vectors
				ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
				LIMIT 5
			`);

			// 2. Fetch practical guide docs
			const practicalGuides = await ctx.payload.find({
				collection: "practical-guides",
				where: {
					id: {
						in: retrieveSqlEmbedding.rows.map(({ doc_id }) => doc_id),
					},
				},
				limit: 3,
				depth: 1,
			});

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

			// 3. Build context from retrieved chunks
			const contextChunks = (
				retrieveSqlEmbedding.rows as {
					doc_id: string;
					text: string;
					similarity_score: number;
				}[]
			)
				.map(({ text }) => text)
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
						content: `Question : ${userMessage}\n\nInformations issues des guides pratiques :\n\n${contextChunks}`,
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
			};
		}),

	chatbotSend: publicProcedure
		.input(
			z.object({
				messages: z.array(messageSchema),
				promptName: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { messages, promptName } = input;

			const apiKey = process.env.ALBERT_API_KEY;
			const apiUrl = process.env.ALBERT_API_URL;

			if (!apiKey || !apiUrl) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "ALBERT_API_KEY or ALBERT_API_URL not configured",
				});
			}

			let systemPrompt = "";

			try {
				systemPrompt = readFileSync(
					path.join(
						process.cwd(),
						`src/utils/prompts/${promptName || "chatbot-system.md"}`,
					),
					"utf-8",
				);
			} catch (_) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to load system prompt",
				});
			}

			// Albert's API only accepts `role` and `content` on message objects.
			const sanitizedMessages = messages.map(({ role, content }) => ({
				role,
				content,
			}));

			const payload = {
				model: "albert-large",
				messages: [
					{
						role: "system",
						content: systemPrompt,
					},
					...sanitizedMessages,
				],
				temperature: 0.1,
				response_format: { type: "json_object" },
				max_completion_tokens: 500,
			};

			const response = await fetch(`${apiUrl}/v1/chat/completions`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				console.error("Albert API error response:", await response.text());
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Error from Albert API: ${response.statusText}`,
				});
			}

			const data = (await response.json()) as { id: string; choices: any[] };

			const { data: message, error: errorMessage } = messageSchema
				.omit({ role: true })
				.safeParse(JSON.parse(data.choices[0].message.content));

			if (!message || errorMessage) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: `Invalid response format from Albert API`,
				});
			}

			if (message?.useRetrieval) {
				const practicalGuides = await retrieveDocsFromUserPrompt({
					payload: ctx.payload,
					userPrompt: messages
						.filter((msg) => msg.role === "user")
						.map((msg) => msg.content)
						.join("\n"),
				});
				return practicalGuides;
			}

			return message;
		}),
});
