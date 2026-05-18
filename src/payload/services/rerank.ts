const RERANK_MODEL = "BAAI/bge-reranker-v2-m3";

export type RerankCandidate<TMeta = unknown> = {
	id: string;
	text: string;
	meta?: TMeta;
};

export type RerankedCandidate<TMeta = unknown> = RerankCandidate<TMeta> & {
	score: number;
};

type AlbertRerankResponse = {
	data?: { index: number; score: number }[];
	results?: { index: number; score?: number; relevance_score?: number }[];
};

function getAlbertConfig(): { apiKey: string; apiUrl: string } {
	const apiKey = process.env.ALBERT_API_KEY;
	const apiUrl = process.env.ALBERT_API_URL;
	if (!apiKey || !apiUrl) {
		throw new Error(
			"ALBERT_API_KEY or ALBERT_API_URL is not configured — required for reranking",
		);
	}
	return { apiKey, apiUrl };
}

/**
 * Reranks candidate passages against a query using Albert API's BAAI/bge-reranker-v2-m3 model.
 * Returns the input candidates sorted by descending relevance score.
 * See https://doc.incubateur.net/alliance/albert-api/guides/rag.
 */
export async function rerankCandidates<TMeta>(
	query: string,
	candidates: RerankCandidate<TMeta>[],
): Promise<RerankedCandidate<TMeta>[]> {
	if (candidates.length === 0) return [];

	const { apiKey, apiUrl } = getAlbertConfig();

	const response = await fetch(`${apiUrl}/v1/rerank`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: RERANK_MODEL,
			query,
			input: candidates.map((c) => c.text),
		}),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(
			`Albert rerank API error ${response.status}: ${response.statusText} — ${body}`,
		);
	}

	const data = (await response.json()) as AlbertRerankResponse;
	const raw = data.data ?? data.results;
	if (!Array.isArray(raw)) {
		throw new Error("Albert rerank API returned an unexpected payload");
	}

	return raw
		.map((row) => {
			const candidate = candidates[row.index];
			if (!candidate) return null;
			const score =
				typeof row.score === "number"
					? row.score
					: typeof (row as { relevance_score?: number }).relevance_score ===
							"number"
						? (row as { relevance_score: number }).relevance_score
						: 0;
			return { ...candidate, score };
		})
		.filter((row): row is RerankedCandidate<TMeta> => row !== null)
		.sort((a, b) => b.score - a.score);
}
