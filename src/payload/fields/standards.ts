import {
	FixedToolbarFeature,
	HeadingFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { Field } from "payload";

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
				...defaultFeatures.filter(
					(feature) =>
						feature.key !== "checklist" &&
						feature.key !== "inlineCode" &&
						feature.key !== "horizontalRule" &&
						feature.key !== "blockquote",
				),
				FixedToolbarFeature(),
				HeadingFeature({
					enabledHeadingSizes: ["h2", "h3", "h4", "h5", "h6"],
				}),
			],
		}),
	},
	html: {
		name: "html",
		type: "text",
		required: true,
		label: { fr: "html" },
		admin: {
			readOnly: true,
			hidden: true,
		},
		hooks: {
			beforeChange: [
				async ({ siblingData }) => {
					if (!siblingData?.content) return "";
					return convertLexicalToHTML({ data: siblingData.content });
				},
			],
		},
	},
	image: {
		name: "image",
		label: "Image",
		type: "upload",
		relationTo: "medias",
		required: true,
	},
} satisfies Record<string, Field>;
