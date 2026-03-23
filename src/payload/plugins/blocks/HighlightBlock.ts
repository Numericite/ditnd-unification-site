import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";
import { defaultWysiwygFeatures } from "../../fields/defaultWysiwygFeatures";

export const HighlightBlock: Block = {
	slug: "highlight",
	labels: {
		singular: "Mise en exergue",
		plural: "Mises en exergue",
	},
	fields: [
		{
			name: "content",
			label: { fr: "Contenu" },
			type: "richText",
			required: true,
			editor: lexicalEditor({
				features: ({ defaultFeatures }) => [
					...defaultWysiwygFeatures({ defaultFeatures }),
				],
			}),
		},
		{
			name: "size",
			label: { fr: "Taille" },
			type: "select",
			options: [
				{ label: "Petit", value: "sm" },
				{ label: "Normal", value: "default" },
				{ label: "Grand", value: "lg" },
			],
			defaultValue: "default",
		},
	],
};
