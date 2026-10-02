import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	CollectionBeforeDeleteHook,
	CollectionConfig,
	Payload,
	PayloadRequest,
} from "payload";
import { sql } from "@payloadcms/db-postgres";
import { simplifiedLexicalEditor } from "../fields/simplifiedWysiwyg";
import { standardFields } from "../fields/standards";
import { slugField } from "../fields/slug";
import { generateEmbedding } from "../services/embedding";
import { generateSimplifiedContent } from "../services/contentSimplification";

function extractTextFromLexical(node: unknown): string {
	if (!node || typeof node !== "object") return "";
	const n = node as Record<string, unknown>;
	if (n.type === "text" && typeof n.text === "string") return n.text;
	if (Array.isArray(n.children))
		return n.children.map(extractTextFromLexical).join(" ");
	if (n.root && typeof n.root === "object")
		return extractTextFromLexical(n.root);
	return "";
}

const SIMPLIFICATION_INTERNAL_FLAG = "simplificationInternalUpdate";
const SIMPLIFICATION_SKIP_FLAG = "skipSimplification";

function shouldTriggerSimplification(
	doc: { _status?: string | null; content?: unknown },
	previousDoc: { _status?: string | null; content?: unknown } | undefined,
): boolean {
	if (doc._status !== "published") return false;
	if (previousDoc?._status !== "published") return true;
	return JSON.stringify(doc.content) !== JSON.stringify(previousDoc.content);
}

const TRANSACTION_WAIT_TIMEOUT_MS = 30_000;

// afterChange runs before the publish is committed: writing earlier would
// read the previous version and overwrite the one being published.
async function waitForTransactionEnd(
	payload: Payload,
	transactionID: PayloadRequest["transactionID"],
): Promise<void> {
	const id = await transactionID;
	if (id === undefined) return;
	const deadline = Date.now() + TRANSACTION_WAIT_TIMEOUT_MS;
	while (payload.db.sessions?.[id] && Date.now() < deadline) {
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
}

async function runSimplification(
	payload: Payload,
	docId: number | string,
	content: unknown,
	transactionID: PayloadRequest["transactionID"],
): Promise<void> {
	try {
		await waitForTransactionEnd(payload, transactionID);

		await payload.update({
			collection: "practical-guides",
			id: docId,
			data: { simplifiedGenerationStatus: "pending", _status: "published" },
			context: { [SIMPLIFICATION_INTERNAL_FLAG]: true },
		});

		const result = await generateSimplifiedContent(content);

		if (result.ok) {
			await payload.update({
				collection: "practical-guides",
				id: docId,
				data: {
					contentSimplified: result.lexical,
					simplifiedGenerationStatus: "ready",
					simplifiedGeneratedAt: new Date().toISOString(),
					_status: "published",
				},
				context: { [SIMPLIFICATION_INTERNAL_FLAG]: true },
			});
		} else {
			console.error(`[Simplification] Guide ${docId} failed: ${result.error}`);
			await payload.update({
				collection: "practical-guides",
				id: docId,
				data: { simplifiedGenerationStatus: "failed", _status: "published" },
				context: { [SIMPLIFICATION_INTERNAL_FLAG]: true },
			});
		}
	} catch (err) {
		console.error(
			`[Simplification] Unexpected failure for guide ${docId}:`,
			err,
		);
	}
}

const afterChangePracticalGuide: CollectionAfterChangeHook = async ({
	doc,
	previousDoc,
	req,
	context,
}) => {
	if (!req?.payload?.db) return doc;
	// Internal bookkeeping update: skip both vector indexing and simplification.
	if (context?.[SIMPLIFICATION_INTERNAL_FLAG] === true) return doc;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = req.payload.db as any;

	// Skip indexing for non-published versions.
	// Only delete vectors if no published version exists anymore (true unpublish).
	if (doc._status !== "published") {
		try {
			const publishedDoc = await req.payload.findByID({
				collection: "practical-guides",
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
				sql`DELETE FROM practical_guide_search_vectors WHERE doc_id = ${String(doc.id)}`,
			);
		} catch (err) {
			console.error(
				"[VectorSearch] Failed to remove vectors on unpublish:",
				doc.id,
				err,
			);
		}
		return doc;
	}

	try {
		const title = typeof doc.title === "string" ? doc.title : "";
		const description =
			typeof doc.description === "string" ? doc.description : "";
		const contentText = extractTextFromLexical(doc.content);

		// Resolve relation names for better semantic search
		const resolveNames = async (
			ids: unknown[],
			collection: "personas" | "conditions" | "themes",
		): Promise<string[]> => {
			if (!Array.isArray(ids)) return [];
			const names = await Promise.all(
				ids.map(async (id) => {
					if (typeof id === "object" && id !== null && "name" in id)
						return (id as { name: string }).name;
					try {
						const item = await req.payload.findByID({
							collection,
							id: id as number,
						});
						return (item as { name?: string }).name || "";
					} catch {
						return "";
					}
				}),
			);
			return names.filter(Boolean);
		};

		const [personaNames, conditionNames, themeNames] = await Promise.all([
			resolveNames(doc.persona || [], "personas"),
			resolveNames(doc.conditions || [], "conditions"),
			resolveNames(doc.themes || [], "themes"),
		]);

		const metadata: string[] = [];
		if (personaNames.length)
			metadata.push(`Public concerné : ${personaNames.join(", ")}`);
		if (conditionNames.length)
			metadata.push(`Troubles : ${conditionNames.join(", ")}`);
		if (themeNames.length) metadata.push(`Thèmes : ${themeNames.join(", ")}`);

		const fullText = [title, description, ...metadata, contentText]
			.filter(Boolean)
			.join(" ")
			.trim();
		if (!fullText) return doc;

		const embedding = await generateEmbedding(fullText);

		await db.drizzle.execute(sql`
			INSERT INTO practical_guide_search_vectors (doc_id, text, embedding)
			VALUES (${String(doc.id)}, ${fullText}, ${JSON.stringify(embedding)}::vector)
			ON CONFLICT (doc_id) DO UPDATE SET
				text = EXCLUDED.text,
				embedding = EXCLUDED.embedding
		`);
	} catch (err) {
		console.error("[VectorSearch] Failed to index guide:", doc.id, err);
	}

	if (
		shouldTriggerSimplification(doc, previousDoc) &&
		!context?.[SIMPLIFICATION_SKIP_FLAG]
	) {
		void runSimplification(req.payload, doc.id, doc.content, req.transactionID);
	}

	return doc;
};

const beforeDeletePracticalGuide: CollectionBeforeDeleteHook = async ({
	id,
	req,
}) => {
	// Delete related views to avoid NOT NULL FK constraint on guide_id
	await req.payload.delete({
		collection: "practical-guide-views",
		where: { guide: { equals: id } },
		req,
	});
};

const afterDeletePracticalGuide: CollectionAfterDeleteHook = async ({
	id,
	req,
}) => {
	if (!req?.payload?.db) return;
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const db = req.payload.db as any;
		await db.drizzle.execute(
			sql`DELETE FROM practical_guide_search_vectors WHERE doc_id = ${String(id)}`,
		);
	} catch (err) {
		console.error("[VectorSearch] Failed to delete embeddings for:", id, err);
	}
};

export const PracticalGuides: CollectionConfig = {
	slug: "practical-guides",
	admin: {
		useAsTitle: "title",
		group: { fr: "Contenus" },
	},
	hooks: {
		beforeDelete: [beforeDeletePracticalGuide],
		afterChange: [afterChangePracticalGuide],
		afterDelete: [afterDeletePracticalGuide],
	},
	labels: {
		singular: "Fiche pratique",
		plural: "Fiches pratiques",
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
									"Titre complet affiché en haut de la page de la fiche pratique et dans le fil d'Ariane. Sert aussi de titre SEO si aucun n'est renseigné.",
							},
						},
						{
							name: "simplifiedTitle",
							type: "text",
							required: false,
							label: { fr: "Titre court" },
							admin: {
								description:
									"Titre affiché sur les cartes des fiches pratiques (page « Fiches pratiques », recherche, recommandations…). Par défaut identique au titre : laissez vide ou inchangé pour qu'il suive le titre.",
							},
							hooks: {
								beforeChange: [
									// Follows `title` until the editor sets a different value.
									({ value, siblingData, originalDoc }) => {
										const input = typeof value === "string" ? value.trim() : "";
										if (!input || input === originalDoc?.title)
											return siblingData?.title ?? (input || null);
										return input;
									},
								],
							},
						},
						standardFields.description,
						standardFields.wysiwyg,
						{
							name: "contentSimplified",
							type: "richText",
							required: false,
							label: { fr: "Contenu simplifié (généré automatiquement)" },
							admin: {
								hidden: true,
								readOnly: true,
								description:
									"Version simplifiée du contenu, régénérée automatiquement à chaque publication.",
							},
							editor: simplifiedLexicalEditor(),
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
					"Affichée sur le site à côté de « Publié le ». Par défaut, la date de création de la fiche.",
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
		slugField("practical-guides", { editable: true }),
		{
			name: "conditions",
			type: "relationship",
			required: false,
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
		{
			name: "practical-guides",
			type: "relationship",
			required: false,
			relationTo: "practical-guides",
			hasMany: true,
			label: { fr: "Fiches pratiques en bas de page" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "courses",
			type: "relationship",
			required: false,
			relationTo: "courses",
			hasMany: true,
			label: { fr: "Formations en bas de page" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "relatedPracticalGuides",
			type: "join",
			collection: "practical-guides",
			on: "practical-guides",
			label: "Autres fiches pratiques qui référencent celle-ci en bas de page",
			admin: {
				position: "sidebar",
				allowCreate: false,
				defaultColumns: ["title", "_status"],
			},
		},
		{
			name: "hideSimplifiedVersion",
			type: "checkbox",
			defaultValue: false,
			label: { fr: "Masquer la version simplifiée sur le site" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "simplifiedGenerationStatus",
			type: "select",
			required: false,
			label: { fr: "Statut génération simplifiée" },
			options: [
				{ value: "pending", label: { fr: "En cours" } },
				{ value: "ready", label: { fr: "Prêt" } },
				{ value: "failed", label: { fr: "Échec" } },
			],
			admin: {
				position: "sidebar",
				readOnly: true,
			},
		},
		{
			name: "simplifiedGeneratedAt",
			type: "date",
			required: false,
			label: { fr: "Dernière génération simplifiée" },
			admin: {
				position: "sidebar",
				readOnly: true,
				date: {
					displayFormat: "dd/MM/yyyy HH:mm",
				},
			},
		},
	],
};
