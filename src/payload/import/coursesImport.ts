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

type FieldKey = keyof Pick<
	Course,
	| "title"
	| "description"
	| "link"
	| "format"
	| "duration"
	| "certifying"
	| "content"
	| "publishedAt"
	| "conditions"
	| "persona"
	| "themes"
>;

const FIELDS: { key: FieldKey; label: string; required: boolean }[] = [
	{ key: "title", label: "Titre", required: true },
	{ key: "description", label: "Description", required: true },
	{ key: "link", label: "Lien de la formation", required: true },
	{ key: "format", label: "Format", required: true },
	{ key: "duration", label: "Durée", required: false },
	{ key: "certifying", label: "Certifiant", required: false },
	{ key: "content", label: "Contenu", required: false },
	{ key: "publishedAt", label: "Date de publication", required: false },
	{ key: "conditions", label: "Troubles", required: true },
	{ key: "persona", label: "Persona", required: true },
	{ key: "themes", label: "Thèmes", required: true },
];

// La date de publication a une valeur par défaut (date de création) : non
// renseignée, elle n'est pas « à compléter ».
const NEVER_MISSING: FieldKey[] = ["publishedAt"];

type RelationKey = "conditions" | "persona" | "themes";

const RELATION_COLLECTIONS = {
	conditions: "conditions",
	persona: "personas",
	themes: "themes",
} as const;

type Certifying = NonNullable<Course["certifying"]>;

const normalize = (value: string) => value.trim().toLowerCase();

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
	input: string,
): T | null => {
	const key = normalize(input);
	return (
		options.find(
			(o) => normalize(o.value) === key || normalize(o.label) === key,
		)?.value ?? null
	);
};

const CERTIFYING_VALUES: Record<string, Certifying> = {
	yes: "yes",
	oui: "yes",
	true: "yes",
	"1": "yes",
	no: "no",
	non: "no",
	false: "no",
	"0": "no",
};

const parseCertifying = (value: unknown): Certifying | null => {
	if (typeof value === "boolean") return value ? "yes" : "no";
	const input = asTrimmedString(value);
	if (!input) return null;
	return CERTIFYING_VALUES[normalize(input)] ?? null;
};

const parseDitndId = (value: unknown): number | null | undefined => {
	if (value === null || value === undefined || value === "") return undefined;
	const n = typeof value === "number" ? value : Number(asTrimmedString(value));
	return Number.isInteger(n) ? n : null;
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

const loadSlugIndex = async (
	payload: Payload,
	user: User,
	collection: (typeof RELATION_COLLECTIONS)[RelationKey],
) => {
	const { docs } = await payload.find({
		collection,
		pagination: false,
		depth: 0,
		overrideAccess: false,
		user,
		select: { slug: true },
	});
	return new Map(
		docs.flatMap((doc) => (doc.slug ? [[normalize(doc.slug), doc.id]] : [])),
	);
};

// Le dernier brouillon d'une formation publiée peut avoir un autre titre : on lit les deux.
const loadExistingCourses = async (payload: Payload, user: User) => {
	const titles = new Set<string>();
	const slugs = new Set<string>();
	const ditndIds = new Set<number>();
	for (const draft of [false, true]) {
		const { docs } = await payload.find({
			collection: "courses",
			pagination: false,
			depth: 0,
			draft,
			overrideAccess: false,
			user,
			select: { title: true, slug: true, ditndId: true },
		});
		for (const doc of docs) {
			if (doc.title) titles.add(normalize(doc.title));
			if (doc.slug) slugs.add(doc.slug);
			if (typeof doc.ditndId === "number") ditndIds.add(doc.ditndId);
		}
	}
	return { titles, slugs, ditndIds };
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

// Pas la config du champ « content » : Turbopack peut charger une autre copie de lexical que convertHTMLToLexical.
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

	const [onSite, conditions, persona, themes] = await Promise.all([
		loadExistingCourses(payload, user),
		loadSlugIndex(payload, user, RELATION_COLLECTIONS.conditions),
		loadSlugIndex(payload, user, RELATION_COLLECTIONS.persona),
		loadSlugIndex(payload, user, RELATION_COLLECTIONS.themes),
	]);
	const slugIndexes: Record<RelationKey, Map<string, number>> = {
		conditions,
		persona,
		themes,
	};

	// Seules les formations réellement créées comptent comme doublons dans l'import.
	const imported = { titles: new Set<string>(), ditndIds: new Set<number>() };

	const duplicateReason = (
		label: string,
		existsOnSite: boolean,
		alreadyImported: boolean,
	) => {
		if (existsOnSite)
			return `Une formation avec ${label} existe déjà sur le site.`;
		if (alreadyImported)
			return `Une formation avec ${label} est déjà importée plus haut : seule la première est importée.`;
		return null;
	};

	let editorConfig: Awaited<ReturnType<typeof getContentEditorConfig>> | null =
		null;

	for (const { source, data } of collectEntries(sources)) {
		if (typeof data !== "object" || data === null || Array.isArray(data)) {
			report.rejected.push({
				title: null,
				source,
				reason: "Entrée illisible : une formation doit être un objet JSON.",
			});
			continue;
		}
		const entry = data as Record<string, unknown>;

		const title = asTrimmedString(entry.title);
		if (!title) {
			report.rejected.push({ title: null, source, reason: "Titre manquant." });
			continue;
		}
		const titleKey = normalize(title);

		const warnings: string[] = [];
		const ditndId = parseDitndId(entry.ditndId);
		if (ditndId === null)
			warnings.push(
				`Identifiant DITND invalide ignoré : « ${String(entry.ditndId)} »`,
			);

		const duplicate =
			duplicateReason(
				"ce titre",
				onSite.titles.has(titleKey),
				imported.titles.has(titleKey),
			) ??
			(typeof ditndId === "number"
				? duplicateReason(
						`l'identifiant DITND ${ditndId}`,
						onSite.ditndIds.has(ditndId),
						imported.ditndIds.has(ditndId),
					)
				: null);
		if (duplicate) {
			report.rejected.push({ title, source, reason: duplicate });
			continue;
		}

		const fields: Partial<Pick<Course, FieldKey>> = { title };

		const description = asTrimmedString(entry.description);
		if (description) fields.description = description;
		const link = asTrimmedString(entry.link);
		if (link) fields.link = link;

		const formatInput = asTrimmedString(entry.format);
		if (formatInput) {
			const format = matchOption<CourseFormat>(COURSE_FORMATS, formatInput);
			if (format) fields.format = format;
			else warnings.push(`Format inconnu ignoré : « ${formatInput} »`);
		}

		const durationInput = asTrimmedString(entry.duration);
		if (durationInput) {
			const duration = matchOption<CourseDuration>(
				COURSE_DURATIONS,
				durationInput,
			);
			if (duration) fields.duration = duration;
			else warnings.push(`Durée inconnue ignorée : « ${durationInput} »`);
		}

		if (entry.certifying !== null && entry.certifying !== undefined) {
			const certifying = parseCertifying(entry.certifying);
			if (certifying) fields.certifying = certifying;
			else
				warnings.push(
					`Valeur « Certifiant » inconnue ignorée : « ${String(entry.certifying)} »`,
				);
		}

		const publishedInput = asTrimmedString(entry.publishedAt);
		if (publishedInput) {
			const date = new Date(publishedInput);
			if (Number.isNaN(date.getTime()))
				warnings.push(
					`Date de publication invalide ignorée : « ${publishedInput} »`,
				);
			else fields.publishedAt = date.toISOString();
		}

		for (const key of ["conditions", "persona", "themes"] as const) {
			const ids: number[] = [];
			const unknown: string[] = [];
			for (const slug of asStringList(entry[key])) {
				const id = slugIndexes[key].get(normalize(slug));
				if (id === undefined) unknown.push(slug);
				else if (!ids.includes(id)) ids.push(id);
			}
			if (ids.length) fields[key] = ids;
			if (unknown.length) {
				const label = FIELDS.find((f) => f.key === key)?.label ?? key;
				warnings.push(
					`Ignoré dans « ${label} » (slug inconnu) : ${unknown.map((u) => `« ${u} »`).join(", ")}`,
				);
			}
		}

		const html = asTrimmedString(entry.contentHtml);
		if (html) {
			try {
				editorConfig ??= await getContentEditorConfig(payload);
				const content = convertHTMLToLexical({
					editorConfig,
					// Le h1 est réservé au titre de la page.
					html: html.replace(/<(\/?)h1\b/gi, "<$1h2"),
					JSDOM,
				});
				if (content.root.children.length) fields.content = content;
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
				// Brouillon : les champs obligatoires manquants sont acceptés.
				data: {
					...fields,
					...(typeof ditndId === "number" && { ditndId }),
					slug: uniqueSlug(title, onSite.slugs),
					_status: "draft",
				} as Course,
			});
			imported.titles.add(titleKey);
			if (typeof ditndId === "number") imported.ditndIds.add(ditndId);

			const summary: ImportedCourse = {
				id: doc.id,
				title,
				filled: [],
				missingRequired: [],
				missingOptional: [],
				warnings,
			};
			for (const field of FIELDS) {
				if (fields[field.key] !== undefined) summary.filled.push(field.label);
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
