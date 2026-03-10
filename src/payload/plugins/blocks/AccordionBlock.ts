import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";
import { defaultWysiwygFeatures } from "../../fields/defaultWysiwygFeatures";

export const AccordionBlock: Block = {
	slug: "accordion",
	labels: {
		singular: "Accordéon",
		plural: "Accordéons",
	},
	admin: {
		disableBlockName: true,
	},
	fields: [
		{
			name: "title",
			label: "Titre",
			type: "text",
			required: true,
			validate: (val: string | undefined | null) => {
				if (!val) return "Le titre de l'accordéon est obligatoire";
				return true;
			},
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
};
