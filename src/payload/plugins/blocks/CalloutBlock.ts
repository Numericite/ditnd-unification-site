import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";
import { dsfrAccentColors } from "~/utils/dsfr-colors";
import { defaultWysiwygFeatures } from "../../fields/defaultWysiwygFeatures";
import { validateDsfrIconId } from "../../fields/validateDsfrIconId";

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
			name: "titleAs",
			label: { fr: "Niveau de titre" },
			type: "select",
			required: false,
			defaultValue: "h3",
			options: [
				{ label: "Titre 2 (h2)", value: "h2" },
				{ label: "Titre 3 (h3)", value: "h3" },
				{ label: "Titre 4 (h4)", value: "h4" },
				{ label: "Titre 5 (h5)", value: "h5" },
				{ label: "Titre 6 (h6)", value: "h6" },
			],
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
			validate: validateDsfrIconId,
			admin: {
				components: {
					Field: "../payload/components/IconPicker",
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
