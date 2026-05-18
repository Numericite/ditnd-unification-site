const EMBEDDING_MODEL = "BAAI/bge-m3";
const EMBEDDING_DIMENSIONS = 1024;

type AlbertEmbeddingResponse = {
	data?: { embedding?: number[] }[];
};

function getAlbertConfig(): { apiKey: string; apiUrl: string } {
	const apiKey = process.env.ALBERT_API_KEY;
	const apiUrl = process.env.ALBERT_API_URL;
	if (!apiKey || !apiUrl) {
		throw new Error(
			"ALBERT_API_KEY or ALBERT_API_URL is not configured — required for embedding generation",
		);
	}
	return { apiKey, apiUrl };
}

/**
 * Generates a 1024-dimensional embedding using Albert API's BAAI/bge-m3 model.
 * Endpoint is OpenAI-compatible (see https://doc.incubateur.net/alliance/albert-api).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
	const { apiKey, apiUrl } = getAlbertConfig();

	const response = await fetch(`${apiUrl}/v1/embeddings`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: EMBEDDING_MODEL,
			input: text,
		}),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(
			`Albert embeddings API error ${response.status}: ${response.statusText} — ${body}`,
		);
	}

	const data = (await response.json()) as AlbertEmbeddingResponse;
	const embedding = data.data?.[0]?.embedding;
	if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
		throw new Error(
			`Albert embeddings API returned an unexpected payload (expected ${EMBEDDING_DIMENSIONS}-dim vector)`,
		);
	}
	return embedding;
}
