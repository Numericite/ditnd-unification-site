import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const News: CollectionConfig = {
	slug: "news",
	admin: {
		useAsTitle: "title",
		group: { fr: "Contenus" },
	},
	labels: {
		singular: "Actualité",
		plural: "Actualités",
	},
	orderable: true,
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			label: { fr: "Titre" },
		},
		slugField("news"),
		{
			name: "description",
			type: "textarea",
			label: { fr: "Description" },
		},
		{
			name: "category",
			type: "text",
			label: { fr: "Catégorie" },
		},
		{
			name: "link",
			type: "group",
			label: { fr: "Lien" },
			fields: [
				{
					name: "url",
					type: "text",
					label: { fr: "URL" },
				},
				{
					name: "label",
					type: "text",
					label: { fr: "Texte du lien" },
				},
			],
		},
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: true,
			label: { fr: "Image" },
			admin: { position: "sidebar" },
		},
		{
			name: "personas",
			type: "relationship",
			relationTo: "personas",
			hasMany: true,
			label: { fr: "Personas" },
			admin: { position: "sidebar" },
		},
	],
};
