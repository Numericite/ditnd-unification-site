import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Field } from "payload";
import { AccordionBlock } from "../plugins/blocks/AccordionBlock";
import { defaultWysiwygFeatures } from "./defaultWysiwygFeatures";
import { CustomImageBlock } from "../plugins/blocks/CustomImageBlock";

export const standardFields = {
	title: {
		name: "title",
		label: "Titre",
		type: "text",
		required: true,
	},
	description: {
		name: "description",
		label: "Description",
		type: "textarea",
		required: true,
	},
	button: {
		label: "Lien associé",
		type: "collapsible",
		admin: {
			initCollapsed: true,
		},
		required: true,
		fields: [
			{
				name: "buttonText",
				label: "Texte du bouton",
				type: "text",
				required: true,
			},
			{
				name: "buttonLink",
				label: "Lien du bouton",
				type: "text",
				required: true,
			},
		],
	},
	wysiwyg: {
		name: "content",
		type: "richText",
		required: true,
		label: { fr: "Contenu" },
		editor: lexicalEditor({
			admin: {
				placeholder: "Commencez à écrire...",
				hideGutter: false,
			},

			features: ({ defaultFeatures }) => [
				...defaultWysiwygFeatures({ defaultFeatures }),
				BlocksFeature({
					blocks: [AccordionBlock, CustomImageBlock],
				}),
			],
		}),
	},
	image: {
		name: "image",
		label: "Image",
		type: "upload",
		relationTo: "medias",
		required: true,
	},
} satisfies Record<string, Field>;
