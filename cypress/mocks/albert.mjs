// Deterministic stand-in for the Albert API (embeddings, rerank, chat) so the
// E2E suite never depends on the real service. Point ALBERT_API_URL at it.
import { createServer } from "node:http";

const PORT = Number(process.env.ALBERT_MOCK_PORT) || 4010;
const DIMENSIONS = 1024;

const SIMPLIFIED_MARKER = "Version simplifiée générée par le bouchon Albert.";

const tokenize = (text) =>
	text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.split(/[^a-z0-9]+/)
		.filter((token) => token.length > 2);

const hash = (token) => {
	let value = 2166136261;
	for (const char of token) {
		value ^= char.charCodeAt(0);
		value = Math.imul(value, 16777619);
	}
	return (value >>> 0) % DIMENSIONS;
};

const embed = (text) => {
	const vector = new Array(DIMENSIONS).fill(0);
	for (const token of tokenize(text)) vector[hash(token)] += 1;
	const norm = Math.hypot(...vector);
	if (norm === 0) {
		vector[0] = 1;
		return vector;
	}
	return vector.map((value) => value / norm);
};

const cosine = (a, b) =>
	a.reduce((sum, value, index) => sum + value * b[index], 0);

const completion = ({ messages = [], response_format }) => {
	const system =
		messages.find((message) => message.role === "system")?.content ?? "";
	const user =
		messages.findLast((message) => message.role === "user")?.content ?? "";

	if (response_format?.type === "json_object") {
		return system.includes('"keywords"')
			? JSON.stringify({
					targetSources: ["guides", "courses"],
					keywords: tokenize(user).slice(0, 5).join(", ") || "autisme",
				})
			: JSON.stringify({ content: "En résumé, voici une réponse de test." });
	}

	const firstLine =
		user
			.split("\n")
			.map((line) => line.replace(/^[#>*\-\d.\s]+/, "").trim())
			.find(Boolean) ?? "";

	return `## En bref\n\n${SIMPLIFIED_MARKER}\n\n${firstLine}`;
};

const routes = {
	"/v1/embeddings": ({ input }) => ({
		object: "list",
		data: (Array.isArray(input) ? input : [input]).map((text, index) => ({
			object: "embedding",
			index,
			embedding: embed(String(text)),
		})),
	}),
	"/v1/rerank": ({ query, documents = [] }) => {
		const target = embed(String(query));
		return {
			data: documents.map((document, index) => ({
				index,
				score: cosine(target, embed(String(document))),
			})),
		};
	},
	"/v1/chat/completions": (body) => ({
		id: "albert-mock",
		object: "chat.completion",
		choices: [
			{
				index: 0,
				finish_reason: "stop",
				message: { role: "assistant", content: completion(body) },
			},
		],
	}),
};

createServer((req, res) => {
	let raw = "";
	req.on("data", (chunk) => {
		raw += chunk;
	});
	req.on("end", () => {
		const route = routes[req.url?.split("?")[0] ?? ""];
		if (req.method !== "POST" || !route) {
			res.writeHead(404).end();
			return;
		}
		try {
			const payload = route(raw ? JSON.parse(raw) : {});
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(payload));
		} catch (error) {
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: String(error) }));
		}
	});
}).listen(PORT, "127.0.0.1", () => {
	console.log(`Albert mock listening on http://127.0.0.1:${PORT}`);
});
