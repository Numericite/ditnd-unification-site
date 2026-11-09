// Stand-in for the Gravity Forms REST API so E2E submissions never create real entries.
// GET /__last-entry returns the last body received, for assertions.
import { createServer } from "node:http";

const PORT = Number(process.env.GRAVITY_FORMS_MOCK_PORT) || 4011;

let lastEntry = null;
let nextId = 1;

createServer((req, res) => {
	let raw = "";
	req.on("data", (chunk) => {
		raw += chunk;
	});
	req.on("end", () => {
		const path = req.url?.split("?")[0] ?? "";

		if (req.method === "GET" && path === "/__last-entry") {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(lastEntry));
			return;
		}

		if (req.method !== "POST" || path !== "/entries") {
			res.writeHead(404).end();
			return;
		}

		if (!req.headers.authorization?.startsWith("Basic ")) {
			res.writeHead(401).end();
			return;
		}

		try {
			lastEntry = JSON.parse(raw);
			res.writeHead(201, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ ...lastEntry, id: String(nextId++) }));
		} catch (error) {
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: String(error) }));
		}
	});
}).listen(PORT, "127.0.0.1", () => {
	console.log(`Gravity Forms mock listening on http://127.0.0.1:${PORT}`);
});
