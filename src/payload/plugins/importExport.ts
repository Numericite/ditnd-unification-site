import { importExportPlugin } from "@payloadcms/plugin-import-export";
import {
	convertLexicalToPlaintext,
	type PlaintextConverters,
} from "@payloadcms/richtext-lexical/plaintext";
import type {
	CollectionConfig,
	CollectionSlug,
	Endpoint,
	Field,
	PayloadHandler,
	Plugin,
} from "payload";
import { isAdmin } from "../hooks";

/**
 * Export CSV / JSON des collections de contenu depuis l'admin Payload
 * (bouton « Exporter » dans le menu « ⋯ » de chaque liste).
 *
 * Choix retenus :
 * - export seul : l'import est désactivé pour toutes les collections ;
 * - réservé aux admins : bouton masqué, collection `exports` et endpoints
 *   de téléchargement / aperçu refusés aux autres rôles ;
 * - téléchargement direct et synchrone : rien n'est stocké (pas de S3, pas
 *   de worker de jobs) ;
 * - en CSV, le rich text Lexical sort en texte brut ; en JSON il reste intact.
 *
 * `users` et `practical-guide-views` sont volontairement exclus.
 */
export const EXPORTABLE_COLLECTIONS = [
	"pages",
	"practical-guides",
	"courses",
	"medias",
	"news",
	"journeys",
	"glossary",
	"glossary-categories",
	"maps",
	"map-markers",
	"map-categories",
	"personas",
	"conditions",
	"themes",
] as const satisfies readonly CollectionSlug[];

const PLUGIN_MENU_ITEM =
	"@payloadcms/plugin-import-export/rsc#ExportListMenuItem";
const ADMIN_ONLY_MENU_ITEM =
	"./components/AdminOnlyExportListMenuItem#AdminOnlyExportListMenuItem";

type LexicalState = Parameters<typeof convertLexicalToPlaintext>[0]["data"];

const isLexicalState = (value: unknown): value is LexicalState =>
	typeof value === "object" &&
	value !== null &&
	"root" in value &&
	typeof (value as { root: unknown }).root === "object";

const joinText = (...parts: unknown[]) =>
	parts
		.filter((part): part is string => typeof part === "string" && part !== "")
		.join("\n");

type BlockFields = Record<string, unknown>;

const text = (value: unknown) => (typeof value === "string" ? value : "");

/** Convertisseur de bloc Lexical inline : ne lit que `node.fields`. */
const fromFields =
	(toText: (fields: BlockFields) => string) =>
	({ node }: { node: { fields: object } }) =>
		toText(node.fields as BlockFields);

/** Bloc de niveau paragraphe : séparé du texte voisin par une ligne vide. */
const blockFromFields = (toText: (fields: BlockFields) => string) => {
	const convert = fromFields(toText);
	return (args: { node: { fields: object } }) => {
		const value = convert(args);
		return value ? `\n\n${value}\n\n` : "";
	};
};

// Sans convertisseur, le contenu des blocs Lexical disparaît du texte brut.
// Seuls les champs textuels sont gardés (pas les options d'affichage).
const plaintextConverters: PlaintextConverters = {
	blocks: {
		accordion: blockFromFields((fields) =>
			(Array.isArray(fields.items) ? (fields.items as BlockFields[]) : [])
				.map((item) =>
					joinText(text(item.title), lexicalToPlaintext(item.content)),
				)
				.join("\n\n"),
		),
		callout: blockFromFields((fields) =>
			joinText(text(fields.title), lexicalToPlaintext(fields.content)),
		),
		highlight: blockFromFields((fields) => lexicalToPlaintext(fields.content)),
		citation: blockFromFields((fields) =>
			joinText(
				text(fields.quote),
				[text(fields.author), text(fields.source)].filter(Boolean).join(", "),
			),
		),
		image: blockFromFields((fields) => text(fields.transcription)),
		youtube: blockFromFields((fields) => text(fields.transcription)),
	},
	inlineBlocks: {
		lang: fromFields((fields) => text(fields.text)),
	},
};

function lexicalToPlaintext(value: unknown): string {
	if (!isLexicalState(value)) return "";
	return convertLexicalToPlaintext({
		converters: plaintextConverters,
		data: value,
	})
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

/** Ajoute à chaque champ rich text (même imbriqué) le hook d'export texte brut. */
function withPlaintextRichTextExport(fields: Field[]): Field[] {
	return fields.map((field) => {
		if (field.type === "richText") {
			return {
				...field,
				custom: {
					...field.custom,
					"plugin-import-export": {
						...field.custom?.["plugin-import-export"],
						hooks: {
							...field.custom?.["plugin-import-export"]?.hooks,
							beforeExport: ({
								format,
								value,
							}: {
								format: string;
								value: unknown;
							}) => (format === "csv" ? lexicalToPlaintext(value) : value),
						},
					},
				},
			};
		}
		if (field.type === "tabs") {
			return {
				...field,
				tabs: field.tabs.map((tab) => ({
					...tab,
					fields: withPlaintextRichTextExport(tab.fields),
				})),
			};
		}
		if (field.type === "blocks") {
			return {
				...field,
				blocks: field.blocks.map((block) => ({
					...block,
					fields: withPlaintextRichTextExport(block.fields),
				})),
			};
		}
		if ("fields" in field && Array.isArray(field.fields)) {
			return { ...field, fields: withPlaintextRichTextExport(field.fields) };
		}
		return field;
	});
}

const adminOnlyHandler =
	(handler: PayloadHandler): PayloadHandler =>
	(req) =>
		isAdmin({ req })
			? handler(req)
			: Response.json({ errors: [{ message: "Forbidden" }] }, { status: 403 });

const restrictToAdmins = (collection: CollectionConfig): CollectionConfig => ({
	...collection,
	access: {
		...collection.access,
		read: isAdmin,
		create: isAdmin,
		update: () => false,
		delete: isAdmin,
	},
	admin: { ...collection.admin, hidden: true },
	endpoints: Array.isArray(collection.endpoints)
		? collection.endpoints.map(
				(endpoint): Endpoint => ({
					...endpoint,
					handler: adminOnlyHandler(endpoint.handler),
				}),
			)
		: collection.endpoints,
});

const exportablePlugin = importExportPlugin({
	collections: EXPORTABLE_COLLECTIONS.map((slug) => ({
		slug,
		import: false,
		export: { disableJobsQueue: true, disableSave: true },
	})),
	overrideExportCollection: ({ collection }) => restrictToAdmins(collection),
	// La collection `imports` est créée même quand l'import est désactivé
	// partout : on la ferme complètement.
	overrideImportCollection: ({ collection }) => ({
		...restrictToAdmins(collection),
		access: {
			read: () => false,
			create: () => false,
			update: () => false,
			delete: () => false,
		},
	}),
});

export const mdaImportExportPlugin: Plugin = async (incomingConfig) => {
	const exportable = new Set<string>(EXPORTABLE_COLLECTIONS);

	const config = await exportablePlugin({
		...incomingConfig,
		collections: incomingConfig.collections?.map((collection) =>
			exportable.has(collection.slug)
				? {
						...collection,
						fields: withPlaintextRichTextExport(collection.fields),
					}
				: collection,
		),
	});

	// Le bouton du plugin s'affiche pour tout utilisateur connecté : on le
	// remplace par une version qui ne s'affiche que pour les admins.
	for (const collection of config.collections ?? []) {
		const items = collection.admin?.components?.listMenuItems;
		if (!items) continue;
		collection.admin = {
			...collection.admin,
			components: {
				...collection.admin?.components,
				listMenuItems: items.map((item) =>
					typeof item === "object" && item.path === PLUGIN_MENU_ITEM
						? { ...item, path: ADMIN_ONLY_MENU_ITEM }
						: item,
				),
			},
		};
	}

	return config;
};
