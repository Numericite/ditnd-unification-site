import { pipeline } from "@huggingface/transformers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let embeddingPipeline: any = null;

/**
 * Returns a singleton feature-extraction pipeline using all-MiniLM-L6-v2 (384 dims).
 * The model is downloaded once and cached by the HuggingFace library.
 */
async function getEmbeddingPipeline() {
	if (!embeddingPipeline) {
		embeddingPipeline = await pipeline(
			"feature-extraction",
			"Xenova/all-MiniLM-L6-v2",
		);
	}
	return embeddingPipeline;
}

/**
 * Generates a 384-dimensional normalized embedding for the given text.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
	const pipe = await getEmbeddingPipeline();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const output = await (pipe as any)(text, { pooling: "mean", normalize: true });
	return Array.from(output.data as Float32Array);
}
