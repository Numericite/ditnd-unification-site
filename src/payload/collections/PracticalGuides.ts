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
			label: { fr: "Description" },
		},
		{
			name: "conditions",
			type: "relationship",
			required: false,
			relationTo: "conditions",
			hasMany: true,
			label: { fr: "Troubles du neurodéveloppement" },
		},
		standardFields.wysiwyg,
		standardFields.html,
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
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image de la fiche pratique" },
		},
		{
			name: "imageBanner",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image de la bannière" },
		},
	],
};
