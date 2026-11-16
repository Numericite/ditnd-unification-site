import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Redirect } from "../payload-types";
import { normalizeFromPath } from "../plugins/redirects";

/**
 * Remplit la collection "redirects" avec les URLs publiées de l'ancien site
 * WordPress et leur cible sur le nouveau site (data/legacy-urls.csv, extrait
 * du tableau de suivi « Agenda refonte pages MDA.xlsx »).
 *
 * Cible du CSV :
 *  - `/fiches-pratiques/{slug}`, `/formations/{slug}` ou `/{slug}` d'une page
 *    CMS : référence au document (survit aux renommages de slug) ;
 *  - tout autre chemin ou URL absolue : URL personnalisée ;
 *  - vide : entrée créée sans cible, à compléter dans l'admin.
 *
 * Idempotent : crée les entrées absentes, complète celles dont la cible est
 * vide, ne touche pas à celles déjà correctes. Une cible différente de celle
 * du CSV est signalée sans être écrasée, sauf avec REDIRECTS_OVERWRITE=true.
 *
 * Usage : yarn seed:redirects
 */

const dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.resolve(dirname, "data/legacy-urls.csv");
const OVERWRITE = process.env.REDIRECTS_OVERWRITE === "true";

type Entry = { from: string; to: string; legacyTitle: string };
type Target = NonNullable<Redirect["to"]>;
type ReferenceCollection = "practical-guides" | "courses" | "pages";

const parseCsvLine = (line: string): string[] => {
	const cells: string[] = [];
	let cell = "";
	let quoted = false;
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (quoted) {
			if (char === '"' && line[i + 1] === '"') {
				cell += '"';
				i++;
			} else if (char === '"') {
				quoted = false;
			} else {
				cell += char;
			}
		} else if (char === '"') {
			quoted = true;
		} else if (char === ",") {
			cells.push(cell);
			cell = "";
		} else {
			cell += char;
		}
	}
	cells.push(cell);
	return cells;
};

const parseCsv = (raw: string): Entry[] =>
	raw
		.split("\n")
		.slice(1)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const [from = "", to = "", legacyTitle = ""] = parseCsvLine(line);
			return {
				from: normalizeFromPath(from),
				to: to.trim(),
				legacyTitle,
			};
		});

const referenceLookup = (
	to: string,
): { collection: ReferenceCollection; slug: string } | null => {
	const match =
		to.match(/^\/(fiches-pratiques|formations)\/([^/]+)$/) ??
		to.match(/^\/()([^/]+)$/);
	if (!match) return null;
	const collection: ReferenceCollection =
		match[1] === "fiches-pratiques"
			? "practical-guides"
			: match[1] === "formations"
				? "courses"
				: "pages";
	return { collection, slug: match[2] as string };
};

const resolveTarget = async (
	payload: Payload,
	to: string,
	warnings: string[],
): Promise<Target | null> => {
	if (!to) return null;
	const lookup = referenceLookup(to);
	if (!lookup) return { type: "custom", url: to };

	const { docs } = await payload.find({
		collection: lookup.collection,
		where: { slug: { equals: lookup.slug } },
		limit: 1,
		depth: 0,
		overrideAccess: true,
	});
	const doc = docs[0] as { id: number; _status?: string | null } | undefined;
	if (!doc) {
		// Une page statique (/a-propos, /contact-pros-cra…) n'est pas une page CMS.
		if (lookup.collection === "pages") return { type: "custom", url: to };
		warnings.push(`cible introuvable : ${to}`);
		return null;
	}
	if (doc._status && doc._status !== "published") {
		warnings.push(`cible non publiée (redirection inactive d'ici là) : ${to}`);
	}
	return {
		type: "reference",
		reference: { relationTo: lookup.collection, value: doc.id },
	} as Target;
};

const targetKey = (to: Redirect["to"] | null | undefined): string | null => {
	if (!to) return null;
	if (to.type === "custom") return to.url?.trim() ? `custom:${to.url}` : null;
	const ref = to.reference;
	if (!ref?.value) return null;
	const id = typeof ref.value === "object" ? ref.value.id : ref.value;
	return `${ref.relationTo}:${id}`;
};

const run = async () => {
	const entries = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
	const payload = await getPayload({ config });

	const existing = await payload.find({
		collection: "redirects",
		depth: 0,
		pagination: false,
		overrideAccess: true,
	});
	const existingByFrom = new Map(existing.docs.map((doc) => [doc.from, doc]));

	const counts = { created: 0, filled: 0, overwritten: 0, unchanged: 0 };
	const warnings: string[] = [];
	const conflicts: string[] = [];
	const todos: string[] = [];

	for (const entry of entries) {
		const entryWarnings: string[] = [];
		const target = await resolveTarget(payload, entry.to, entryWarnings);
		warnings.push(...entryWarnings.map((w) => `${entry.from} → ${w}`));
		if (!target) todos.push(entry.from);

		const current = existingByFrom.get(entry.from);
		if (!current) {
			await payload.create({
				collection: "redirects",
				data: {
					from: entry.from,
					legacyTitle: entry.legacyTitle,
					to: target ?? { type: "reference" },
				},
				overrideAccess: true,
			});
			counts.created += 1;
			continue;
		}

		const currentKey = targetKey(current.to);
		const nextKey = targetKey(target);
		if (!target || currentKey === nextKey) {
			counts.unchanged += 1;
			continue;
		}
		if (currentKey && !OVERWRITE) {
			conflicts.push(
				`${entry.from} : base = ${currentKey}, CSV = ${nextKey} (conservé)`,
			);
			counts.unchanged += 1;
			continue;
		}
		await payload.update({
			collection: "redirects",
			id: current.id,
			data: {
				to: target,
				legacyTitle: current.legacyTitle || entry.legacyTitle,
			},
			overrideAccess: true,
		});
		if (currentKey) counts.overwritten += 1;
		else counts.filled += 1;
	}

	console.log(
		`Redirections : ${counts.created} créées, ${counts.filled} complétées, ${counts.overwritten} écrasées, ${counts.unchanged} inchangées (${entries.length} lignes CSV, ${existing.totalDocs} en base avant seed).`,
	);
	if (todos.length > 0) {
		console.log(
			`\nSans cible (à compléter dans l'admin) :\n  ${todos.join("\n  ")}`,
		);
	}
	if (warnings.length > 0) {
		console.log(`\nAvertissements :\n  ${warnings.join("\n  ")}`);
	}
	if (conflicts.length > 0) {
		console.log(
			`\nCibles différentes en base (relancer avec REDIRECTS_OVERWRITE=true pour appliquer le CSV) :\n  ${conflicts.join("\n  ")}`,
		);
	}
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
