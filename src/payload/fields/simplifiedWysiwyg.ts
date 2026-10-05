import {
	BlocksFeature,
	type FeatureProviderServer,
	FixedToolbarFeature,
	HeadingFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

const restrictedFeatures = (
	defaultFeatures: FeatureProviderServer[],
	fixedToolbar: boolean,
) => [
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
				"relationship",
				"strikethrough",
				"subscript",
				"superscript",
				"underline",
				"upload",
			].includes(feature.key),
	),
	HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
	...(fixedToolbar ? [FixedToolbarFeature()] : []),
];

// Same slug and fields as the main AccordionBlock so the front-end converter
// renders it, but its items only accept the FALC whitelist.
const SimplifiedAccordionBlock: Block = {
	slug: "accordion",
	labels: {
		singular: "Groupe d'accordéons",
		plural: "Groupes d'accordéons",
	},
	admin: {
		disableBlockName: true,
	},
	fields: [
		{
			name: "openMode",
			type: "radio",
			required: true,
			defaultValue: "single",
			label: { fr: "Comportement d'ouverture" },
			options: [
				{ label: "Un seul accordéon ouvert à la fois", value: "single" },
				{
					label: "Plusieurs accordéons peuvent être ouverts",
					value: "multiple",
				},
			],
		},
		{
			name: "items",
			label: "Accordéons",
			type: "array",
			minRows: 1,
			labels: {
				singular: "Accordéon",
				plural: "Accordéons",
			},
			fields: [
				{
					name: "title",
					label: "Titre",
					type: "text",
					required: true,
				},
				{
					name: "content",
					label: "Contenu",
					type: "richText",
					editor: lexicalEditor({
						features: ({ defaultFeatures }) =>
							restrictedFeatures(defaultFeatures, false),
					}),
				},
			],
		},
	],
};

// Restricted editor matching the FALC whitelist (h2/h3 headings, lists,
// bold, links, accordions). Shared by the `contentSimplified` field of
// practical guides and the simplified content generator global.
export function simplifiedLexicalEditor({
	fixedToolbar = false,
}: {
	fixedToolbar?: boolean;
} = {}) {
	return lexicalEditor({
		features: ({ defaultFeatures }) => [
			...restrictedFeatures(defaultFeatures, fixedToolbar),
			BlocksFeature({ blocks: [SimplifiedAccordionBlock] }),
		],
	});
}
