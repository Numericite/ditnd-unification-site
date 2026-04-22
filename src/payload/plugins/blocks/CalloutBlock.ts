import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";
import { dsfrAccentColors } from "~/utils/dsfr-colors";
import { defaultWysiwygFeatures } from "../../fields/defaultWysiwygFeatures";

export const CalloutBlock: Block = {
	slug: "callout",
	labels: {
		singular: "Mise en avant",
		plural: "Mises en avant",
	},
	fields: [
		{
			name: "title",
			label: { fr: "Titre" },
			type: "text",
			required: false,
			admin: {
				description: "Titre de la mise en avant (optionnel)",
			},
		},
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
			name: "iconId",
			label: { fr: "Icône" },
			type: "text",
			required: false,
			admin: {
				components: {
					Description: "../payload/components/IconIdDescription",
				},
			},
		},
		{
			name: "colorVariant",
			label: { fr: "Couleur d'accentuation" },
			type: "select",
			required: false,
			options: [...dsfrAccentColors],
			admin: {
				description: "Couleur de la bordure latérale (optionnel)",
			},
		},
	],
};
