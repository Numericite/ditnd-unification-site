import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	CollectionConfig,
	Payload,
} from "payload";
import { sql } from "@payloadcms/db-postgres";
import { standardFields } from "../fields/standards";
import { slugField } from "../fields/slug";
import { generateEmbedding } from "../services/embedding";
import type { Course, CoursesSelect } from "../payload-types";
import {
	COURSE_DURATIONS,
	COURSE_FORMATS,
	courseDurationLabel,
	courseFormatLabel,
} from "~/utils/courses";

// Calcule le texte indexé d'une formation publiée et met à jour son vecteur
// de recherche. Utilisé par le hook afterChange et par le script de
// réindexation (yarn reindex:courses). Lève une erreur en cas d'échec.
export const indexCourseSearchVector = async (
	payload: Payload,
	doc: Course,
): Promise<void> => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = payload.db as any;

	const title = typeof doc.title === "string" ? doc.title : "";
	const description =
		typeof doc.description === "string" ? doc.description : "";
	const format = courseFormatLabel(doc.format);
	const duration = courseDurationLabel(doc.duration);

	// Resolve single relation names
	const resolveName = async (
		id: unknown,
		collection: "personas" | "conditions" | "themes",
	): Promise<string> => {
		if (typeof id === "object" && id !== null && "name" in id)
			return (id as { name: string }).name;
		if (typeof id !== "number") return "";
		try {
			const item = await payload.findByID({ collection, id });
			return (item as { name?: string }).name || "";
		} catch {
			return "";
		}
	};

	const resolveNames = async (
		ids: unknown,
		collection: "personas" | "conditions" | "themes",
	): Promise<string[]> => {
		if (!Array.isArray(ids)) return [];
		const names = await Promise.all(
			ids.map((id) => resolveName(id, collection)),
		);
		return names.filter(Boolean);
	};

	const [personaNames, conditionNames, themeNames] = await Promise.all([
		resolveNames(doc.persona, "personas"),
		resolveNames(doc.conditions, "conditions"),
		resolveNames(doc.themes, "themes"),
	]);

	const metadata: string[] = [];
	if (personaNames.length)
		metadata.push(`Public concerné : ${personaNames.join(", ")}`);
	if (conditionNames.length)
		metadata.push(`Troubles : ${conditionNames.join(", ")}`);
	if (themeNames.length) metadata.push(`Thèmes : ${themeNames.join(", ")}`);
	if (format) metadata.push(`Format : ${format}`);
	if (duration) metadata.push(`Durée : ${duration}`);

	const fullText = [title, description, ...metadata]
		.filter(Boolean)
		.join(" ")
		.trim();
	if (!fullText) return;

	const embedding = await generateEmbedding(fullText);

	await db.drizzle.execute(sql`
		INSERT INTO courses_search_vectors (doc_id, text, embedding)
		VALUES (${String(doc.id)}, ${fullText}, ${JSON.stringify(embedding)}::vector)
		ON CONFLICT (doc_id) DO UPDATE SET
			text = EXCLUDED.text,
			embedding = EXCLUDED.embedding
	`);
};

const afterChangeCourse: CollectionAfterChangeHook = async ({ doc, req }) => {
	if (!req?.payload?.db) return doc;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = req.payload.db as any;

	// Skip indexing for non-published versions.
	// Only delete vectors if no published version exists anymore (true unpublish).
	if (doc._status !== "published") {
		try {
			const publishedDoc = await req.payload.findByID({
				collection: "courses",
				id: doc.id,
				draft: false,
			});
			// A published version still exists — keep its vectors intact
			if (publishedDoc?._status === "published") {
				return doc;
			}
		} catch {
			// No published version found — fall through to delete vectors
		}

		try {
			await db.drizzle.execute(
				sql`DELETE FROM courses_search_vectors WHERE doc_id = ${String(doc.id)}`,
			);
		} catch (err) {
			console.error(
				"[VectorSearch] Failed to remove course vectors on unpublish:",
				doc.id,
				err,
			);
		}
		return doc;
	}

	try {
		await indexCourseSearchVector(req.payload, doc);
	} catch (err) {
		console.error("[VectorSearch] Failed to index course:", doc.id, err);
	}

	return doc;
};

const afterDeleteCourse: CollectionAfterDeleteHook = async ({ id, req }) => {
	if (!req?.payload?.db) return;
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const db = req.payload.db as any;
		await db.drizzle.execute(
			sql`DELETE FROM courses_search_vectors WHERE doc_id = ${String(id)}`,
		);
	} catch (err) {
		console.error(
			"[VectorSearch] Failed to delete course embeddings for:",
			id,
			err,
		);
	}
};

export const courseCardSelect = {
	title: true,
	description: true,
	slug: true,
	link: true,
	format: true,
	duration: true,
	themes: true,
	conditions: true,
	image: true,
	imageBanner: true,
	_status: true,
} satisfies CoursesSelect<true>;

export const Courses: CollectionConfig = {
	slug: "courses",
	admin: {
		useAsTitle: "title",
		group: { fr: "Contenus" },
		defaultColumns: ["title", "format", "_status", "updatedAt"],
	},
	defaultPopulate: courseCardSelect,
	hooks: {
		afterChange: [afterChangeCourse],
		afterDelete: [afterDeleteCourse],
	},
	labels: {
		singular: "Formation",
		plural: "Formations",
	},
	versions: {
		drafts: true,
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: { fr: "Contenu" },
					fields: [
						{
							name: "title",
							type: "text",
							required: true,
							label: { fr: "Titre" },
						},
						standardFields.longDescription,
						{
							name: "link",
							type: "text",
							required: true,
							label: { fr: "Lien de la formation" },
						},
						{
							type: "row",
							fields: [
								{
									name: "format",
									type: "select",
									required: true,
									label: { fr: "Format" },
									options: [...COURSE_FORMATS],
									admin: { width: "33%" },
								},
								{
									name: "duration",
									type: "select",
									required: false,
									label: { fr: "Durée" },
									options: [...COURSE_DURATIONS],
									admin: { width: "33%" },
								},
								{
									name: "certifying",
									type: "radio",
									required: false,
									label: { fr: "Certifiant" },
									options: [
										{ label: "Oui", value: "yes" },
										{ label: "Non", value: "no" },
									],
									admin: {
										width: "33%",
										layout: "horizontal",
										description: "Non affiché sur le site pour l'instant.",
									},
								},
							],
						},
						{
							...standardFields.wysiwyg,
							required: false,
						},
					],
				},
			],
		},
		{
			name: "publishedAt",
			type: "date",
			required: false,
			label: { fr: "Date de publication" },
			defaultValue: () => new Date().toISOString(),
			admin: {
				position: "sidebar",
				description:
					"Affichée sur le site à côté de « Publié le ». Par défaut, la date de création de la formation.",
				date: {
					displayFormat: "dd/MM/yyyy",
				},
			},
		},
		{
			name: "lastUpdatedAt",
			type: "date",
			required: false,
			label: { fr: "Date de mise à jour" },
			admin: {
				position: "sidebar",
				description:
					"Facultative. Si renseignée, une mention « Mis à jour le » est affichée sur le site à côté de « Publié le ».",
				date: {
					displayFormat: "dd/MM/yyyy",
				},
			},
		},
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image à la une" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "imageBanner",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Bannière" },
			admin: {
				position: "sidebar",
			},
		},
		slugField("courses", { editable: true }),
		{
			name: "conditions",
			type: "relationship",
			required: true,
			relationTo: "conditions",
			hasMany: true,
			label: { fr: "Troubles du neurodéveloppement" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "persona",
			type: "relationship",
			required: true,
			relationTo: "personas",
			hasMany: true,
			label: { fr: "Persona" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "themes",
			type: "relationship",
			required: true,
			relationTo: "themes",
			hasMany: true,
			label: { fr: "Thèmes" },
			admin: {
				position: "sidebar",
			},
		},
	],
};
