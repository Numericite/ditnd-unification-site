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
		},
		{
			name: "slug",
			type: "text",
			unique: true,
			required: true,
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
		},
		{
			name: "conditions",
			type: "relationship",
			required: false,
			relationTo: "conditions",
			hasMany: true,
		},
		{
			name: "content",
			type: "richText",
			required: true,
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
		},
		{
			name: "theme",
			type: "relationship",
			required: true,
			relationTo: "themes",
			hasMany: true,
		},
		{
			name: "practical-guides",
			type: "relationship",
			required: false,
			relationTo: "practical-guides",
			hasMany: true,
		},
		{
			name: "courses",
			type: "relationship",
			required: false,
			relationTo: "courses",
			hasMany: true,
		},
	],
};
