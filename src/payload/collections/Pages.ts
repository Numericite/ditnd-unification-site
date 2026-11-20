import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	CollectionConfig,
	Payload,
} from "payload";
import { sql } from "@payloadcms/db-postgres";
import { standardFields } from "../fields/standards";
import { slugField } from "../fields/slug";
import { validatePageSlug } from "../fields/validatePageSlug";
import { generateEmbedding } from "../services/embedding";
import type { Page } from "../payload-types";
import { lexicalToText } from "~/utils/tools";

// Calcule le texte indexé d'une page publiée et met à jour son vecteur de
// recherche. Utilisé par le hook afterChange et par le script de réindexation
// (yarn reindex:pages). Lève une erreur en cas d'échec.
export const indexPageSearchVector = async (
	payload: Payload,
	doc: Page,
): Promise<void> => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = payload.db as any;

	const title = typeof doc.title === "string" ? doc.title : "";
	const section =
		typeof doc.section === "number"
			? await payload
					.findByID({ collection: "page-sections", id: doc.section, depth: 0 })
					.catch(() => null)
			: doc.section;
	const contentText = lexicalToText(doc.content);

	const fullText = [
		title,
		section?.title ? `Rubrique : ${section.title}` : "",
		contentText,
	]
		.filter(Boolean)
		.join(" ")
		.trim();
	if (!fullText) return;

	const embedding = await generateEmbedding(fullText);

	await db.drizzle.execute(sql`
		INSERT INTO pages_search_vectors (doc_id, text, embedding)
		VALUES (${String(doc.id)}, ${fullText}, ${JSON.stringify(embedding)}::vector)
		ON CONFLICT (doc_id) DO UPDATE SET
			text = EXCLUDED.text,
			embedding = EXCLUDED.embedding
	`);
};

const afterChangePage: CollectionAfterChangeHook = async ({ doc, req }) => {
	if (!req?.payload?.db) return doc;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = req.payload.db as any;

	// Skip indexing for non-published versions.
	// Only delete vectors if no published version exists anymore (true unpublish).
	if (doc._status !== "published") {
		try {
			const publishedDoc = await req.payload.findByID({
				collection: "pages",
				id: doc.id,
				draft: false,
				depth: 0,
				select: { _status: true },
				req,
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
				sql`DELETE FROM pages_search_vectors WHERE doc_id = ${String(doc.id)}`,
			);
		} catch (err) {
			console.error(
				"[VectorSearch] Failed to remove page vectors on unpublish:",
				doc.id,
				err,
			);
		}
		return doc;
	}

	try {
		await indexPageSearchVector(req.payload, doc);
	} catch (err) {
		console.error("[VectorSearch] Failed to index page:", doc.id, err);
	}

	return doc;
};

const afterDeletePage: CollectionAfterDeleteHook = async ({ id, req }) => {
	if (!req?.payload?.db) return;
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const db = req.payload.db as any;
		await db.drizzle.execute(
			sql`DELETE FROM pages_search_vectors WHERE doc_id = ${String(id)}`,
		);
	} catch (err) {
		console.error(
			"[VectorSearch] Failed to delete page embeddings for:",
			id,
			err,
		);
	}
};

export const Pages: CollectionConfig = {
	slug: "pages",
	admin: {
		useAsTitle: "title",
		group: { fr: "Contenus" },
		defaultColumns: ["title", "section", "_status", "updatedAt"],
	},
	hooks: {
		afterChange: [afterChangePage],
		afterDelete: [afterDeletePage],
	},
	labels: {
		singular: "Page",
		plural: "Pages",
	},
	versions: {
		drafts: {
			autosave: {
				interval: 2000,
				showSaveDraftButton: true,
			},
		},
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
							admin: {
								description:
									"Titre complet affiché en haut de la page et dans le fil d'Ariane. Sert aussi de titre SEO si aucun n'est renseigné.",
							},
						},
						standardFields.wysiwyg,
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
					"Affichée sur le site à côté de « Publié le ». Par défaut, la date de création de la page.",
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
					"Facultative. Si renseignée, une mention « Mis à jour le » est affichée sur le site.",
				date: {
					displayFormat: "dd/MM/yyyy",
				},
			},
		},
		{
			name: "showDates",
			type: "checkbox",
			defaultValue: true,
			label: { fr: "Afficher les dates de publication et de mise à jour" },
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
		{
			name: "section",
			type: "relationship",
			relationTo: "page-sections",
			label: { fr: "Rubrique" },
			admin: {
				position: "sidebar",
				description:
					"Facultative. Une page rangée dans une rubrique est accessible sur /{rubrique}/{identifiant}, et la rubrique apparaît dans son fil d'Ariane. La modifier change l'URL publique : pensez à ajouter une redirection.",
			},
		},
		{
			name: "module",
			type: "select",
			label: { fr: "Module intégré" },
			options: [
				{
					label: "Formulaire de contact des particuliers",
					value: "contact-particuliers",
				},
				{
					label: "Formulaire de contact des professionnels des CRA",
					value: "contact-pros-cra",
				},
			],
			admin: {
				position: "sidebar",
				description: "Facultatif. Affiché sous le contenu de la page.",
			},
		},
		slugField("pages", { editable: true, validate: validatePageSlug }),
	],
};
