import type { CollectionConfig } from "payload";
import { slugify } from "~/utils/tools";
import { standardFields } from "../fields/standards";

export const PracticalGuides: CollectionConfig = {
	slug: "practical-guides",
	admin: {
		useAsTitle: "title",
	},
	labels: {
		singular: "Fiche pratique",
		plural: "Fiches pratiques",
	},
	versions: {
		drafts: true,
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
			label: { fr: "Identifiant texte" },
			admin: {
				position: "sidebar",
				readOnly: true,
				hidden: true,
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
		standardFields.description,
		{
			name: "conditions",
			type: "relationship",
			required: false,
			relationTo: "conditions",
			hasMany: true,
			label: { fr: "Troubles du neurodéveloppement" },
			admin: {
				position: "sidebar",
			},
		},
		standardFields.wysiwyg,
		{
			name: "persona",
			type: "relationship",
			required: true,
			relationTo: "personas",
			hasMany: true,
			label: { fr: "Persona" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "themes",
			type: "relationship",
			required: true,
			relationTo: "themes",
			hasMany: true,
			label: { fr: "Thèmes" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "practical-guides",
			type: "relationship",
			required: false,
			relationTo: "practical-guides",
			hasMany: true,
			label: { fr: "Fiches pratiques" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "courses",
			type: "relationship",
			required: false,
			relationTo: "courses",
			hasMany: true,
			label: { fr: "Formations" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image de la fiche pratique" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "imageBanner",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image de la bannière" },
			admin: {
				position: "sidebar",
			},
		},
	],
};
