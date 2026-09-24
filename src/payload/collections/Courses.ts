import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	CollectionConfig,
} from "payload";
import { sql } from "@payloadcms/db-postgres";
import { standardFields } from "../fields/standards";
import { slugField } from "../fields/slug";
import { generateEmbedding } from "../services/embedding";

const afterChangeCourse: CollectionAfterChangeHook = async ({ doc, req }) => {
	if (!req?.payload?.db) return doc;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = req.payload.db as any;

	try {
		const title = typeof doc.title === "string" ? doc.title : "";
		const description =
			typeof doc.description === "string" ? doc.description : "";
		const type = typeof doc.type === "string" ? doc.type : "";

		// Resolve single relation names
		const resolveName = async (
			id: unknown,
			collection: "personas" | "conditions" | "themes",
		): Promise<string> => {
			if (typeof id === "object" && id !== null && "name" in id)
				return (id as { name: string }).name;
			if (typeof id !== "number") return "";
			try {
				const item = await req.payload.findByID({ collection, id });
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

		const [personaName, conditionNames, themeName] = await Promise.all([
			resolveName(doc.persona, "personas"),
			resolveNames(doc.conditions, "conditions"),
			resolveName(doc.theme, "themes"),
		]);

		const metadata: string[] = [];
		if (personaName) metadata.push(`Public concerné : ${personaName}`);
		if (conditionNames.length)
			metadata.push(`Troubles : ${conditionNames.join(", ")}`);
		if (themeName) metadata.push(`Thème : ${themeName}`);
		if (type) metadata.push(`Type de ressource : ${type}`);

		const fullText = [title, description, ...metadata]
			.filter(Boolean)
			.join(" ")
			.trim();
		if (!fullText) return doc;

		const embedding = await generateEmbedding(fullText);

		await db.drizzle.execute(sql`
			INSERT INTO courses_search_vectors (doc_id, text, embedding)
			VALUES (${String(doc.id)}, ${fullText}, ${JSON.stringify(embedding)}::vector)
			ON CONFLICT (doc_id) DO UPDATE SET
				text = EXCLUDED.text,
				embedding = EXCLUDED.embedding
		`);
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

export const Courses: CollectionConfig = {
	slug: "courses",
	admin: {
		useAsTitle: "title",
		group: { fr: "Contenus" },
	},
	hooks: {
		afterChange: [afterChangeCourse],
		afterDelete: [afterDeleteCourse],
	},
	labels: {
		singular: "Formation",
		plural: "Formations",
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			label: { fr: "Titre" },
		},
		slugField("courses"),
		standardFields.longDescription,
		{
			name: "link",
			type: "text",
			required: true,
			label: { fr: "Lien de la formation" },
		},
		{
			name: "type",
			type: "select",
			required: true,
			label: { fr: "Type de ressource" },
			options: ["MOOC", "Webinaire", "Présentiel"],
		},
		{
			...standardFields.wysiwyg,
			required: false,
		},
		{
			name: "theme",
			type: "relationship",
			required: true,
			relationTo: "themes",
			label: { fr: "Thèmes" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "persona",
			type: "relationship",
			required: true,
			relationTo: "personas",
			label: { fr: "Persona" },
			admin: {
				position: "sidebar",
			},
		},
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
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Bannière" },
			admin: {
				position: "sidebar",
			},
		},
	],
};
