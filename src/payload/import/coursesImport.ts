import { JSDOM } from "jsdom";
import {
	convertHTMLToLexical,
	editorConfigFactory,
	HeadingFeature,
} from "@payloadcms/richtext-lexical";
import type { Payload } from "payload";
import type { Course, User } from "../payload-types";
import {
	COURSE_DURATIONS,
	COURSE_FORMATS,
	type CourseDuration,
	type CourseFormat,
} from "~/utils/courses";
import { slugify } from "~/utils/tools";
import type { CoursesImportReport, ImportedCourse } from "./coursesImportTypes";

export type ImportSource = {
	name: string;
	data: unknown;
};

type FieldKey =
	| "title"
	| "description"
	| "link"
	| "format"
	| "duration"
	| "certifying"
	| "content"
	| "publishedAt"
	| "image"
	| "imageBanner"
	| "conditions"
	| "persona"
	| "themes";

const FIELDS: { key: FieldKey; label: string; required: boolean }[] = [
	{ key: "title", label: "Titre", required: true },
	{ key: "description", label: "Description", required: true },
	{ key: "link", label: "Lien de la formation", required: true },
	{ key: "format", label: "Format", required: true },
	{ key: "duration", label: "Durée", required: false },
	{ key: "certifying", label: "Certifiant", required: false },
	{ key: "content", label: "Contenu", required: false },
	{ key: "publishedAt", label: "Date de publication", required: false },
	{ key: "image", label: "Image à la une", required: false },
	{ key: "imageBanner", label: "Bannière", required: false },
	{ key: "conditions", label: "Troubles", required: true },
	{ key: "persona", label: "Persona", required: true },
	{ key: "themes", label: "Thèmes", required: true },
];

// La date de publication a une valeur par défaut (date de création) : non
// renseignée, elle n'est pas « à compléter ».
const NEVER_MISSING: FieldKey[] = ["publishedAt"];

type RelationCollection = "conditions" | "personas" | "themes";

const normalizeKey = (value: string) => value.trim().toLowerCase();

export const normalizeTitle = (value: string) =>
	value.trim().replace(/\s+/g, " ").toLowerCase();

const asTrimmedString = (value: unknown): string | null => {
	if (typeof value === "number") return String(value);
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed || null;
};

const asStringList = (value: unknown): string[] => {
	if (Array.isArray(value))
		return value.map(asTrimmedString).filter((v): v is string => !!v);
	const single = asTrimmedString(value);
	if (!single) return [];
	return single
		.split(",")
		.map((v) => v.trim())
		.filter(Boolean);
};

const matchOption = <T extends string>(
	options: readonly { label: string; value: T }[],
	raw: string,
): T | null => {
	const key = normalizeKey(raw);
	return (
		options.find(
			(o) => normalizeKey(o.value) === key || normalizeKey(o.label) === key,
		)?.value ?? null
	);
};

const CERTIFYING_VALUES: Record<string, "yes" | "no"> = {
	yes: "yes",
	oui: "yes",
	true: "yes",
	"1": "yes",
	no: "no",
	non: "no",
	false: "no",
	"0": "no",
};

const parseCertifying = (value: unknown): "yes" | "no" | null => {
	if (typeof value === "boolean") return value ? "yes" : "no";
	const raw = asTrimmedString(value);
	if (!raw) return null;
	return CERTIFYING_VALUES[normalizeKey(raw)] ?? null;
};

const collectEntries = (sources: ImportSource[]) => {
	const entries: { source: string; data: unknown }[] = [];
	for (const { name, data } of sources) {
		const list = Array.isArray(data) ? data : [data];
		list.forEach((item, index) => {
			entries.push({
				source: list.length > 1 ? `${name}, n° ${index + 1}` : name,
				data: item,
			});
		});
	}
	return entries;
};

const loadRelationIndex = async (
	payload: Payload,
	collection: RelationCollection,
) => {
	const { docs } = await payload.find({
		collection,
		pagination: false,
		depth: 0,
		select: { slug: true, name: true },
	});
	const index = new Map<string, number>();
	for (const doc of docs) {
		const { id, name } = doc as { id: number; name?: string };
		if (name) index.set(normalizeKey(name), id);
	}
	// Les slugs sont prioritaires sur les noms.
	for (const doc of docs) {
		const { id, slug } = doc as { id: number; slug?: string };
		if (slug) index.set(normalizeKey(slug), id);
	}
	return index;
};

// Le dernier brouillon d'une formation publiée peut avoir un autre titre : on lit les deux.
const loadExistingCourses = async (payload: Payload) => {
	const titles = new Set<string>();
	const slugs = new Set<string>();
	const ditndIds = new Set<number>();
	for (const draft of [false, true]) {
		const { docs } = await payload.find({
			collection: "courses",
			pagination: false,
			depth: 0,
			draft,
			select: { title: true, slug: true, ditndId: true },
		});
		for (const doc of docs) {
			if (doc.title) titles.add(normalizeTitle(doc.title));
			if (doc.slug) slugs.add(doc.slug);
			if (typeof doc.ditndId === "number") ditndIds.add(doc.ditndId);
		}
	}
	return { titles, slugs, ditndIds };
};

const parseDitndId = (value: unknown): number | null | undefined => {
	if (value === null || value === undefined || value === "") return undefined;
	const n = typeof value === "number" ? value : Number(asTrimmedString(value));
	return Number.isFinite(n) ? n : null;
};

const uniqueSlug = (title: string, taken: Set<string>) => {
	const base = slugify(title) || "formation";
	let slug = base;
	for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
	taken.add(slug);
	return slug;
};

const EXCLUDED_FEATURES = [
	"checklist",
	"inlineCode",
	"blockquote",
	"upload",
	"relationship",
	"heading",
];

// Ne pas réutiliser la config du champ « content » : Turbopack peut charger
// deux copies de lexical, et ses nœuds sont alors refusés par l'éditeur
// headless de convertHTMLToLexical (« is not a constructor that subclasses
// LexicalNode »). Construite ici, la config partage la copie de la conversion.
const getContentEditorConfig = (payload: Payload) =>
	editorConfigFactory.fromFeatures({
		config: payload.config,
		features: ({ defaultFeatures }) => [
			...defaultFeatures.filter((f) => !EXCLUDED_FEATURES.includes(f.key)),
			HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4", "h5", "h6"] }),
		],
	});

export async function importCourses({
	payload,
	user,
	sources,
}: {
	payload: Payload;
	user: User;
	sources: ImportSource[];
}): Promise<CoursesImportReport> {
	const report: CoursesImportReport = { imported: [], rejected: [] };

	const [existing, conditionsIndex, personasIndex, themesIndex] =
		await Promise.all([
			loadExistingCourses(payload),
			loadRelationIndex(payload, "conditions"),
			loadRelationIndex(payload, "personas"),
			loadRelationIndex(payload, "themes"),
		]);

	const relationIndexes = {
		conditions: conditionsIndex,
		persona: personasIndex,
		themes: themesIndex,
	} as const;

	let editorConfig: Awaited<ReturnType<typeof getContentEditorConfig>> | null =
		null;
	const seenTitles = new Set<string>();
	const seenDitndIds = new Set<number>();

	for (const { source, data } of collectEntries(sources)) {
		if (typeof data !== "object" || data === null || Array.isArray(data)) {
			report.rejected.push({
				title: null,
				source,
				reason: "Entrée illisible : une formation doit être un objet JSON.",
			});
			continue;
		}
		const raw = data as Record<string, unknown>;

		const title = asTrimmedString(raw.title)?.replace(/\s+/g, " ") ?? null;
		if (!title) {
			report.rejected.push({ title: null, source, reason: "Titre manquant." });
			continue;
		}
		const titleKey = normalizeTitle(title);
		if (existing.titles.has(titleKey) || seenTitles.has(titleKey)) {
			report.rejected.push({
				title,
				source,
				reason: existing.titles.has(titleKey)
					? "Une formation portant ce titre existe déjà sur le site."
					: "Titre en double dans l'import : seule la première formation est importée.",
			});
			continue;
		}

		const warnings: string[] = [];

		const ditndId = parseDitndId(raw.ditndId);
		if (ditndId === null) {
			warnings.push(
				`Identifiant DITND invalide ignoré : « ${String(raw.ditndId)} »`,
			);
		} else if (ditndId !== undefined) {
			if (existing.ditndIds.has(ditndId) || seenDitndIds.has(ditndId)) {
				report.rejected.push({
					title,
					source,
					reason: existing.ditndIds.has(ditndId)
						? `Une formation avec l'identifiant DITND ${ditndId} existe déjà sur le site.`
						: `Identifiant DITND ${ditndId} en double dans l'import : seule la première formation est importée.`,
				});
				continue;
			}
			seenDitndIds.add(ditndId);
		}
		seenTitles.add(titleKey);

		const values: Partial<Record<FieldKey, unknown>> = {};

		values.title = title;
		const description = asTrimmedString(raw.description);
		if (description) values.description = description;
		const link = asTrimmedString(raw.link);
		if (link) values.link = link;

		const formatRaw = asTrimmedString(raw.format);
		if (formatRaw) {
			const format = matchOption<CourseFormat>(COURSE_FORMATS, formatRaw);
			if (format) values.format = format;
			else warnings.push(`Format inconnu ignoré : « ${formatRaw} »`);
		}

		const durationRaw = asTrimmedString(raw.duration);
		if (durationRaw) {
			const duration = matchOption<CourseDuration>(
				COURSE_DURATIONS,
				durationRaw,
			);
			if (duration) values.duration = duration;
			else warnings.push(`Durée inconnue ignorée : « ${durationRaw} »`);
		}

		if (raw.certifying !== null && raw.certifying !== undefined) {
			const certifying = parseCertifying(raw.certifying);
			if (certifying) values.certifying = certifying;
			else
				warnings.push(
					`Valeur « Certifiant » inconnue ignorée : « ${String(raw.certifying)} »`,
				);
		}

		const publishedRaw = asTrimmedString(raw.publishedAt);
		if (publishedRaw) {
			const date = new Date(publishedRaw);
			if (Number.isNaN(date.getTime()))
				warnings.push(
					`Date de publication invalide ignorée : « ${publishedRaw} »`,
				);
			else values.publishedAt = date.toISOString();
		}

		for (const key of ["conditions", "persona", "themes"] as const) {
			const index = relationIndexes[key];
			const ids: number[] = [];
			const unknown: string[] = [];
			for (const item of asStringList(raw[key])) {
				const id = index.get(normalizeKey(item));
				if (id === undefined) unknown.push(item);
				else if (!ids.includes(id)) ids.push(id);
			}
			if (ids.length) values[key] = ids;
			if (unknown.length) {
				const label = FIELDS.find((f) => f.key === key)?.label ?? key;
				warnings.push(
					`${label} inconnu${unknown.length > 1 ? "s" : ""} ignoré${unknown.length > 1 ? "s" : ""} : ${unknown.map((u) => `« ${u} »`).join(", ")}`,
				);
			}
		}

		const html = asTrimmedString(raw.contentHtml);
		if (html) {
			try {
				editorConfig ??= await getContentEditorConfig(payload);
				const content = convertHTMLToLexical({
					editorConfig,
					// Le h1 est réservé au titre de la page.
					html: html.replace(/<(\/?)h1\b/gi, "<$1h2"),
					JSDOM,
				});
				if (content.root.children.length) values.content = content;
			} catch (error) {
				payload.logger.error({ err: error, msg: "[CoursesImport] HTML" });
				warnings.push("Contenu illisible ignoré (HTML non convertible).");
			}
		}

		try {
			const doc = await payload.create({
				collection: "courses",
				draft: true,
				overrideAccess: false,
				user,
				data: {
					...(values as Partial<Course>),
					...(typeof ditndId === "number" && { ditndId }),
					slug: uniqueSlug(title, existing.slugs),
					_status: "draft",
				} as Course,
			});
			const summary: ImportedCourse = {
				id: doc.id,
				title,
				filled: [],
				missingRequired: [],
				missingOptional: [],
				warnings,
			};
			for (const field of FIELDS) {
				if (values[field.key] !== undefined) summary.filled.push(field.label);
				else if (NEVER_MISSING.includes(field.key)) continue;
				else if (field.required) summary.missingRequired.push(field.label);
				else summary.missingOptional.push(field.label);
			}
			report.imported.push(summary);
		} catch (error) {
			payload.logger.error({ err: error, msg: "[CoursesImport] create" });
			report.rejected.push({
				title,
				source,
				reason: `Erreur à l'enregistrement : ${error instanceof Error ? error.message : String(error)}`,
			});
		}
	}

	return report;
}
