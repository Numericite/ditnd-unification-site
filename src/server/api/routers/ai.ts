import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { readFileSync } from "node:fs";
import path from "node:path";

const systemPrompt = readFileSync(
	path.join(process.cwd(), "src/utils/prompts/chatbot-system.md"),
	"utf-8",
);

// 2) CONCERNED DISORDER (choose exactly one):
// - DYS (Troubles cognitifs spécifiques qui affectent certaines fonctions humaines) (e.g. dyslexia, dyspraxia, dyscalculia)
// - TSA (Trouble du spectre de l'autisme) (Autism Spectrum Disorder)
// - TDI (Trouble du développement intellectuel) (Intellectual developmental disorder)
// - TDAH (Trouble du déficit de l'attention avec ou sans hyperactivité) (Attention Deficit / Hyperactivity Disorder)

export const messageSchema = z.object({
	role: z.enum(["user", "assistant"]),
	content: z.string(),
	choices: z.array(z.string()).optional(),
	userChoices: z.array(z.string()).optional(),
});

export const aiRouter = createTRPCRouter({
	chatbotSend: publicProcedure
		.input(z.array(messageSchema))
		.mutation(async ({ input }) => {
			const apiKey = process.env.ALBERT_API_KEY;
			const apiUrl = process.env.ALBERT_API_URL;

			if (!apiKey || !apiUrl) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "ALBERT_API_KEY or ALBERT_API_URL not configured",
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
				response_format: {
					type: "json_object",
				},
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

			const data = await response.json();

			return data;
		}),
});
