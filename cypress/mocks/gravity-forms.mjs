// Stand-in for the Gravity Forms REST API so E2E submissions never create real entries nor send emails.
// GET /__last-entry returns the last entry received (with its id), GET /__last-notified-entry the id of the last entry whose notifications were requested.
import { createServer } from "node:http";

const PORT = Number(process.env.GRAVITY_FORMS_MOCK_PORT) || 4011;
const NOTIFICATIONS_PATH = /^\/entries\/(\d+)\/notifications$/;

let lastEntry = null;
let lastNotifiedEntryId = null;
let nextId = 1;

const sendJson = (res, status, body) => {
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(JSON.stringify(body));
};

createServer((req, res) => {
	let raw = "";
	req.on("data", (chunk) => {
		raw += chunk;
	});
	req.on("end", () => {
		const path = req.url?.split("?")[0] ?? "";

		if (req.method === "GET" && path === "/__last-entry") {
			sendJson(res, 200, lastEntry);
			return;
		}

		if (req.method === "GET" && path === "/__last-notified-entry") {
			sendJson(res, 200, { entryId: lastNotifiedEntryId });
			return;
		}

		const notificationsMatch = path.match(NOTIFICATIONS_PATH);
		if (req.method !== "POST" || (path !== "/entries" && !notificationsMatch)) {
			res.writeHead(404).end();
			return;
		}

		if (!req.headers.authorization?.startsWith("Basic ")) {
			res.writeHead(401).end();
			return;
		}

		if (notificationsMatch) {
			lastNotifiedEntryId = notificationsMatch[1];
			sendJson(res, 200, ["mock-notification"]);
			return;
		}

		try {
			lastEntry = { ...JSON.parse(raw), id: String(nextId++) };
			sendJson(res, 201, lastEntry);
		} catch (error) {
			sendJson(res, 400, { error: String(error) });
		}
	});
}).listen(PORT, "127.0.0.1", () => {
	console.log(`Gravity Forms mock listening on http://127.0.0.1:${PORT}`);
});
