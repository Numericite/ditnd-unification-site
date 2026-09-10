import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";
import { defaultWysiwygFeatures } from "../../fields/defaultWysiwygFeatures";

export const AccordionBlock: Block = {
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
						features: ({ defaultFeatures }) => [
							...defaultWysiwygFeatures({ defaultFeatures }),
						],
					}),
				},
			],
		},
	],
};
