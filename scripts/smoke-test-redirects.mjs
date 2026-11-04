import { readFile } from "node:fs/promises";

/**
 * Smoke-test des redirections de l'ancien site WordPress.
 * Voir docs/plan-redirections-seo.md.
 *
 * Pour chaque ligne de src/payload/seed/data/legacy-urls.csv :
 *  - cible renseignée : une seule 301 vers la cible du CSV, puis 200 ;
 *  - cible vide : signalée (repli de section ou 404).
 * Plus quelques cas fixes : chemins identiques (200), sitemaps Yoast,
 * slash final, query string transférée, page inconnue (404).
 *
 * Usage :
 *   BASE_URL=https://maisondelautisme.gouv.fr yarn smoke:redirects
 *   BASE_URL=https://ditnd.numericite.eu BASIC_AUTH=user:motdepasse yarn smoke:redirects
 */

const BASE_URL = (process.env.BASE_URL ?? "").replace(/\/+$/, "");
if (!BASE_URL) {
	console.error(
		"BASE_URL manquant (ex. BASE_URL=https://maisondelautisme.gouv.fr)",
	);
	process.exit(2);
}
const AUTH_HEADER = process.env.BASIC_AUTH
	? {
			Authorization: `Basic ${Buffer.from(process.env.BASIC_AUTH).toString("base64")}`,
		}
	: {};
const CSV_URL = new URL(
	"../src/payload/seed/data/legacy-urls.csv",
	import.meta.url,
);
const MAX_HOPS = 5;
const CONCURRENCY = 6;

const parseCsvLine = (line) => {
	const cells = [];
	let cell = "";
	let quoted = false;
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (quoted) {
			if (char === '"' && line[i + 1] === '"') {
				cell += '"';
				i++;
			} else if (char === '"') quoted = false;
			else cell += char;
		} else if (char === '"') quoted = true;
		else if (char === ",") {
			cells.push(cell);
			cell = "";
		} else cell += char;
	}
	cells.push(cell);
	return cells;
};

const origin = new URL(BASE_URL).origin;

/** Suit les redirections à la main pour relever chaque saut. */
const trace = async (path) => {
	const hops = [];
	let url = new URL(path, BASE_URL).toString();
	for (let i = 0; i <= MAX_HOPS; i++) {
		const sameOrigin = new URL(url).origin === origin;
		// Cible externe : on vérifie la redirection, pas le site tiers.
		if (!sameOrigin) return { hops, finalUrl: url, finalStatus: null };
		const res = await fetch(url, {
			method: "GET",
			redirect: "manual",
			headers: AUTH_HEADER,
		});
		await res.body?.cancel();
		const location = res.headers.get("location");
		if (res.status >= 300 && res.status < 400 && location) {
			const next = new URL(location, url).toString();
			hops.push({ status: res.status, from: url, to: next });
			url = next;
			continue;
		}
		return { hops, finalUrl: url, finalStatus: res.status };
	}
	return { hops, finalUrl: url, finalStatus: "boucle" };
};

const display = (url) =>
	url.startsWith(origin) ? url.slice(origin.length) || "/" : url;

const describe = ({ hops, finalUrl, finalStatus }) =>
	[
		...hops.map((h) => String(h.status)),
		`${display(finalUrl)} ${finalStatus ?? "(externe)"}`,
	].join(" → ");

/**
 * Vérifie une redirection applicative : un éventuel 308 de Next sur le slash
 * final, puis exactement une 301, puis 200 sur la cible attendue.
 */
const checkRedirect = (result, expectedTarget) => {
	const errors = [];
	const statuses = result.hops.map((h) => h.status);
	const appHops = statuses[0] === 308 ? statuses.slice(1) : statuses;
	const bad = statuses.filter((s) => s === 302 || s === 307);
	if (bad.length > 0) errors.push(`redirection temporaire (${bad.join(", ")})`);
	if (appHops.length === 0) errors.push("pas de redirection");
	else if (appHops[0] !== 301 && bad.length === 0)
		errors.push(`${appHops[0]} au lieu de 301`);
	if (appHops.length > 1)
		errors.push(`chaîne de ${appHops.length} redirections`);
	if (result.finalStatus !== null && result.finalStatus !== 200) {
		errors.push(`cible en ${result.finalStatus}`);
	}
	if (expectedTarget) {
		const expected = new URL(expectedTarget, BASE_URL);
		const actual = new URL(result.finalUrl);
		const samePlace =
			expected.origin === actual.origin &&
			expected.pathname.replace(/\/+$/, "") ===
				actual.pathname.replace(/\/+$/, "");
		if (!samePlace)
			errors.push(
				`cible ${display(actual.toString())} au lieu de ${expectedTarget}`,
			);
	}
	return errors;
};

const buildCases = async () => {
	const rows = (await readFile(CSV_URL, "utf8"))
		.split("\n")
		.slice(1)
		.map((line) => line.trim())
		.filter(Boolean)
		.map(parseCsvLine);

	const cases = rows.map(([from, to]) =>
		to
			? { label: from, path: from, check: (r) => checkRedirect(r, to) }
			: { label: from, path: from, todo: true, check: () => [] },
	);

	const firstWithTarget = rows.find(([, to]) =>
		to?.startsWith("/fiches-pratiques/"),
	);
	if (firstWithTarget) {
		const [from, to] = firstWithTarget;
		cases.push(
			{
				label: `${from}/ (slash final)`,
				path: `${from}/`,
				check: (r) => checkRedirect(r, to),
			},
			{
				label: `${from}?utm_source=smoke (query string)`,
				path: `${from}?utm_source=smoke`,
				check: (r) => {
					const errors = checkRedirect(r, to);
					if (new URL(r.finalUrl).searchParams.get("utm_source") !== "smoke") {
						errors.push("query string perdue");
					}
					return errors;
				},
			},
		);
	}

	for (const path of [
		"/",
		"/accessibilite",
		"/mentions-legales",
		"/plan-du-site",
		"/recherche",
	]) {
		cases.push({
			label: `${path} (même chemin)`,
			path,
			check: (r) =>
				r.hops.length === 0 && r.finalStatus === 200
					? []
					: ["200 attendu sans redirection"],
		});
	}
	for (const path of ["/sitemap_index.xml", "/page-sitemap.xml"]) {
		cases.push({
			label: path,
			path,
			check: (r) => checkRedirect(r, "/sitemap.xml"),
		});
	}
	cases.push({
		label: "/smoke-test-page-inexistante (404)",
		path: "/smoke-test-page-inexistante",
		check: (r) =>
			r.finalStatus === 404 ? [] : [`${r.finalStatus} au lieu de 404`],
	});
	return cases;
};

const run = async () => {
	const cases = await buildCases();
	const results = new Array(cases.length);
	let next = 0;
	await Promise.all(
		Array.from({ length: CONCURRENCY }, async () => {
			while (next < cases.length) {
				const index = next++;
				const testCase = cases[index];
				try {
					const result = await trace(testCase.path);
					results[index] = { testCase, result, errors: testCase.check(result) };
				} catch (error) {
					results[index] = {
						testCase,
						result: null,
						errors: [`requête échouée : ${error.message}`],
					};
				}
			}
		}),
	);

	const failures = results.filter((r) => r.errors.length > 0);
	const todos = results.filter((r) => r.testCase.todo);
	const unauthorized = results.filter((r) => r.result?.finalStatus === 401);

	if (unauthorized.length > 0) {
		console.error(
			`${unauthorized.length} réponses en 401 : renseigner (ou corriger) BASIC_AUTH=utilisateur:motdepasse.`,
		);
		process.exit(2);
	}

	if (failures.length > 0) {
		console.log(`Échecs (${failures.length}) :`);
		for (const { testCase, result, errors } of failures) {
			console.log(`  ✗ ${testCase.label}\n      ${errors.join(" ; ")}`);
			if (result) console.log(`      ${describe(result)}`);
		}
		console.log("");
	}
	if (todos.length > 0) {
		console.log(`Sans cible dans le CSV (${todos.length}) :`);
		for (const { testCase, result } of todos) {
			console.log(
				`  · ${testCase.label}\n      ${result ? describe(result) : "requête échouée"}`,
			);
		}
		console.log("");
	}
	console.log(
		`${results.length - failures.length - todos.length} OK, ${failures.length} en échec, ${todos.length} sans cible (${BASE_URL}).`,
	);
	process.exitCode = failures.length > 0 ? 1 : 0;
};

await run();
