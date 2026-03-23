import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI {
	if (!client) {
		client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	}
	return client;
}

/**
 * Generates a 1536-dimensional embedding for the given text using OpenAI text-embedding-3-small.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
	const response = await getClient().embeddings.create({
		model: "text-embedding-3-small",
		input: text,
	});
	return response.data[0]!.embedding;
}
