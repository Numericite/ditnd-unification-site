import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	CollectionBeforeDeleteHook,
	CollectionConfig,
	Payload,
} from "payload";
import { sql } from "@payloadcms/db-postgres";
import { HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { slugify } from "~/utils/tools";
import { standardFields } from "../fields/standards";
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

// Context flag set by the recursive payload.update calls we issue from
// runSimplification(). When present, the hook becomes a no-op so we don't
// re-index vectors or re-trigger Albert on our own bookkeeping writes.
const SIMPLIFICATION_INTERNAL_FLAG = "simplificationInternalUpdate";

function shouldTriggerSimplification(
	doc: { _status?: string | null; content?: unknown },
	previousDoc: { _status?: string | null; content?: unknown } | undefined,
): boolean {
	if (doc._status !== "published") return false;
	if (previousDoc?._status !== "published") return true;
	return JSON.stringify(doc.content) !== JSON.stringify(previousDoc.content);
}

async function runSimplification(
	payload: Payload,
	docId: number | string,
	content: unknown,
): Promise<void> {
	try {
		await payload.update({
			collection: "practical-guides",
			id: docId,
			data: { simplifiedGenerationStatus: "pending" },
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
				},
				context: { [SIMPLIFICATION_INTERNAL_FLAG]: true },
			});
		} else {
			console.error(`[Simplification] Guide ${docId} failed: ${result.error}`);
			await payload.update({
				collection: "practical-guides",
				id: docId,
				data: { simplifiedGenerationStatus: "failed" },
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

	// Fire-and-forget the simplified-content generation. Albert calls can
	// take 30-60s; we don't block the editor's publish on that. Errors are
	// trapped inside runSimplification — this Promise never rejects.
	if (shouldTriggerSimplification(doc, previousDoc)) {
		void runSimplification(req.payload, doc.id, doc.content);
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
			name: "title",
			type: "text",
			required: true,
			label: { fr: "Titre" },
		},
		{
			name: "slug",
			type: "text",
			required: true,
			label: { fr: "Identifiant texte" },
			admin: {
				position: "sidebar",
				readOnly: true,
				hidden: true,
			},
			hooks: {
				beforeChange: [
					async ({ siblingData }) => {
						if (!siblingData?.title) return "";
						return slugify(siblingData.title);
					},
				],
			},
		},
		standardFields.description,
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
		standardFields.wysiwyg,
		{
			name: "contentSimplified",
			type: "richText",
			required: false,
			label: { fr: "Contenu simplifié (généré automatiquement)" },
			admin: {
				readOnly: true,
				description:
					"Version simplifiée du contenu, régénérée automatiquement à chaque publication.",
			},
			editor: lexicalEditor({
				features: ({ defaultFeatures }) => [
					...defaultFeatures.filter(
						(feature) =>
							![
								"align",
								"blockquote",
								"checklist",
								"heading",
								"horizontalRule",
								"indent",
								"inlineCode",
								"italic",
								"strikethrough",
								"subscript",
								"superscript",
								"underline",
							].includes(feature.key),
					),
					HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
				],
			}),
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
			label: { fr: "Fiches pratiques" },
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
			label: { fr: "Formations" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image de la fiche pratique" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "imageBanner",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image de la bannière" },
			admin: {
				position: "sidebar",
			},
		},
	],
};
