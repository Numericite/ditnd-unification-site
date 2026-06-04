// Orchestrates the Albert call that simplifies a Lexical document.
//
// Flow:
//   1. Lexical (with custom blocks) → markdown subset
//   2. Albert (albert-large) ← system prompt + that markdown
//   3. Markdown response → restricted Lexical
//   4. One retry on transient failure
//
// Returns a discriminated result so the caller (the afterChange hook)
// can update `simplifiedGenerationStatus` accordingly without try/catch
// chains.

import { readFileSync } from "node:fs";
import path from "node:path";
import { lexicalToMarkdown } from "./lexicalToMarkdown";
import {
	markdownToLexical,
	type SerializedLexicalRoot,
} from "./markdownToLexical";

const ALBERT_MODEL = "albert-large";
const ALBERT_TEMPERATURE = 0.2;
const ALBERT_MAX_TOKENS = 2000;
const ALBERT_TIMEOUT_MS = 90_000;
const RETRY_COUNT = 1;
const RETRY_DELAY_MS = 2_000;

export type SimplificationResult =
	| { ok: true; lexical: SerializedLexicalRoot }
	| { ok: false; error: string };

let cachedSystemPrompt: string | null = null;

function loadSystemPrompt(): string {
	if (cachedSystemPrompt !== null) return cachedSystemPrompt;
	cachedSystemPrompt = readFileSync(
		path.join(process.cwd(), "src/utils/prompts/content-simplification.md"),
		"utf-8",
	);
	return cachedSystemPrompt;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callAlbert(
	apiUrl: string,
	apiKey: string,
	systemPrompt: string,
	userMarkdown: string,
): Promise<string> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), ALBERT_TIMEOUT_MS);

	try {
		const response = await fetch(`${apiUrl}/v1/chat/completions`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			signal: controller.signal,
			body: JSON.stringify({
				model: ALBERT_MODEL,
				temperature: ALBERT_TEMPERATURE,
				max_completion_tokens: ALBERT_MAX_TOKENS,
				messages: [
					{ role: "system", content: systemPrompt },
					{ role: "user", content: userMarkdown },
				],
			}),
		});

		if (!response.ok) {
			const body = await response.text().catch(() => "");
			throw new Error(`Albert HTTP ${response.status}: ${body.slice(0, 200)}`);
		}

		const data = (await response.json()) as {
			choices?: { message?: { content?: string } }[];
		};
		const content = data.choices?.[0]?.message?.content;
		if (typeof content !== "string" || content.trim().length === 0) {
			throw new Error("Albert returned empty content");
		}
		return content;
	} finally {
		clearTimeout(timeout);
	}
}

export async function generateSimplifiedContent(
	content: unknown,
): Promise<SimplificationResult> {
	const apiKey = process.env.ALBERT_API_KEY;
	const apiUrl = process.env.ALBERT_API_URL;

	if (!apiKey || !apiUrl) {
		return {
			ok: false,
			error: "ALBERT_API_KEY or ALBERT_API_URL not configured",
		};
	}

	const sourceMarkdown = lexicalToMarkdown(content);
	if (!sourceMarkdown.trim()) {
		return { ok: false, error: "Source content is empty" };
	}

	let systemPrompt: string;
	try {
		systemPrompt = loadSystemPrompt();
	} catch (err) {
		return {
			ok: false,
			error: `Failed to load system prompt: ${err instanceof Error ? err.message : String(err)}`,
		};
	}

	let lastError = "unknown";
	for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
		if (attempt > 0) await sleep(RETRY_DELAY_MS);
		try {
			const responseMarkdown = await callAlbert(
				apiUrl,
				apiKey,
				systemPrompt,
				sourceMarkdown,
			);
			const lexical = markdownToLexical(responseMarkdown);
			if (lexical.root.children.length === 0) {
				lastError = "Albert response produced an empty Lexical document";
				continue;
			}
			return { ok: true, lexical };
		} catch (err) {
			lastError = err instanceof Error ? err.message : String(err);
		}
	}

	return { ok: false, error: lastError };
}
