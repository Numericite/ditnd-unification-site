import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";
import { defaultWysiwygFeatures } from "../fields/defaultWysiwygFeatures";

export const AccordionBlock: Block = {
	slug: "accordion",
	admin: {
		disableBlockName: true,
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
};
