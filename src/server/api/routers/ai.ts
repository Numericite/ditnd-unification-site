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
import { pipeline } from "@huggingface/transformers";
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

const retrieveDocsFromUserPrompt = async ({
	payload,
	userPrompt,
}: {
	payload: Payload;
	userPrompt: string;
}) => {
	const modelSentence = await pipeline(
		"feature-extraction",
		"Xenova/all-MiniLM-L6-v2",
	);

	const output = await modelSentence(userPrompt, {
		pooling: "mean",
		normalize: true,
	});

	const embedding = Array.from(output.data);
	const retrieveSqlEmbedding = await payload.db.drizzle.execute(sql`
		SELECT doc_id, text, embedding <-> ${JSON.stringify(embedding)}::vector as similarity_score FROM practical_guide_vectors
		ORDER BY embedding <-> ${JSON.stringify(embedding)}::vector
		LIMIT 10
	`);

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
	chatbotSend: publicProcedure
		.input(z.array(messageSchema))
		.mutation(async ({ input, ctx }) => {
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
					path.join(process.cwd(), "src/utils/prompts/chatbot-system.md"),
					"utf-8",
				);
			} catch (_) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to load system prompt",
				});
			}

			const payload = {
				model: "albert-small",
				messages: [
					{
						role: "system",
						content: systemPrompt,
					},
					...input,
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
					userPrompt: input
						.filter((msg) => msg.role === "user")
						.map((msg) => msg.content)
						.join("\n"),
				});
				return practicalGuides;
			}

			return message;
		}),
});
