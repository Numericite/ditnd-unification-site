import type { CollectionConfig } from "payload";
import {
	lexicalEditor,
	FixedToolbarFeature,
	HeadingFeature,
} from "@payloadcms/richtext-lexical";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { slugify } from "~/utils/tools";

export const PracticalGuides: CollectionConfig = {
	slug: "practical-guides",
	admin: {
		useAsTitle: "title",
	},
	labels: {
		singular: "Fiche pratique",
		plural: "Fiches pratiques",
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			label: { fr: "Titre" },
		},
		{
			name: "slug",
			type: "text",
			unique: true,
			required: true,
			label: { fr: "Jeton" },
			admin: {
				readOnly: true,
			},
			hooks: {
				beforeChange: [
					async ({ siblingData }) => {
						if (!siblingData?.title) return "";
						return slugify(siblingData.title);
					},
				],
			},
		},
		{
			name: "description",
			type: "text",
			required: true,
			label: { fr: "description" },
		},
		{
			name: "conditions",
			type: "relationship",
			required: false,
			relationTo: "conditions",
			hasMany: true,
			label: { fr: "Troubles du neurodéveloppement" },
		},
		{
			name: "content",
			type: "richText",
			required: true,
			label: { fr: "Contenu" },
			editor: lexicalEditor({
				admin: {
					placeholder: "Content of the practical guide",
					hideGutter: false,
				},

				features: ({ defaultFeatures }) => [
					...defaultFeatures,
					FixedToolbarFeature(),
					HeadingFeature({
						enabledHeadingSizes: ["h2", "h3", "h4", "h5", "h6"],
					}),
				],
			}),
		},
		{
			name: "html",
			type: "text",
			required: true,
			label: { fr: "html" },
			admin: {
				readOnly: true,
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
		{
			name: "persona",
			type: "relationship",
			required: true,
			relationTo: "personas",
			hasMany: true,
			label: { fr: "Persona" },
		},
		{
			name: "themes",
			type: "relationship",
			required: true,
			relationTo: "themes",
			hasMany: true,
			label: { fr: "Thèmes" },
		},
		{
			name: "practical-guides",
			type: "relationship",
			required: false,
			relationTo: "practical-guides",
			hasMany: true,
			label: { fr: "Fiches pratiques" },
		},
		{
			name: "courses",
			type: "relationship",
			required: false,
			relationTo: "courses",
			hasMany: true,
			label: { fr: "Formations" },
		},
		{
			name: "viewCount",
			type: "number",
			required: true,
			defaultValue: 0,
			label: { fr: "Nombre de vues" },
			admin: {
				readOnly: true,
			},
		},
	],
};
