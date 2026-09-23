import config from "@payload-config";
import { getPayload } from "payload";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeFromPath } from "../plugins/redirects";

/**
 * Pré-remplit la collection "redirects" avec les URLs publiées de l'ancien
 * site WordPress (data/legacy-urls.csv, extrait de
 * maisondelautisme_contenus_structures.xlsx), cible vide.
 *
 * L'équipe contenu complète ensuite les cibles dans l'admin Payload au fil de
 * la création des pages. Idempotent : les entrées déjà présentes (même `from`)
 * sont conservées telles quelles, jamais écrasées.
 *
 * Usage : yarn seed:redirects
 */

const dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.resolve(dirname, "data/legacy-urls.csv");

const parseCsv = (raw: string): Array<{ from: string; legacyTitle: string }> =>
	raw
		.split("\n")
		.slice(1)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			// Le champ titre peut être quoté (virgules dans les titres).
			const match = line.match(/^([^,]+),"?(.*?)"?$/);
			return {
				from: normalizeFromPath(match?.[1] ?? line),
				legacyTitle: (match?.[2] ?? "").replace(/""/g, '"'),
			};
		});

const run = async () => {
	const entries = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
	const payload = await getPayload({ config });

	const existing = await payload.find({
		collection: "redirects",
		limit: 1000,
		pagination: false,
		overrideAccess: true,
	});
	const existingFroms = new Set(
		existing.docs.map((doc) => (doc as { from?: string }).from),
	);

	let created = 0;
	for (const entry of entries) {
		if (existingFroms.has(entry.from)) continue;
		await payload.create({
			collection: "redirects",
			data: {
				from: entry.from,
				legacyTitle: entry.legacyTitle,
				to: { type: "reference" },
			},
			overrideAccess: true,
		});
		created += 1;
	}

	console.log(
		`Redirections : ${created} entrées créées, ${entries.length - created} déjà présentes (${existing.totalDocs} au total avant seed).`,
	);
};

// payload run n'attend pas les promesses en suspens : top-level await requis.
try {
	await run();
} catch (error) {
	console.error("Seed des redirections échoué :", error);
	process.exitCode = 1;
} finally {
	process.exit();
}
