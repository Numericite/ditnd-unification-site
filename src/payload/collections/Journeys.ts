import type { CollectionConfig } from "payload";

export const Journeys: CollectionConfig = {
	slug: "journeys",
	admin: {
		useAsTitle: "journey_name",
	},
	labels: {
		singular: "Parcours",
		plural: "Parcours",
	},
	fields: [
		{
			name: "journey_name",
			type: "text",
			required: true,
			label: { fr: "Nom de votre parcours" },
		},
		{
			name: "persona",
			type: "relationship",
			relationTo: "personas",
			required: true,
			label: { fr: "Persona" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image de la formation" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "chapter",
			type: "array",
			required: true,
			label: { fr: "Chapitres" },
			fields: [
				{
					name: "chapter-name",
					type: "text",
					required: true,
					label: { fr: "Nom du chapitre" },
				},
				{
					name: "practical-guides",
					type: "relationship",
					relationTo: "practical-guides",
					required: true,
					hasMany: true,
					label: { fr: "Fiches pratiques" },
				},
				{
					name: "courses",
					type: "relationship",
					relationTo: "courses",
					hasMany: true,
					label: { fr: "Formations" },
				},
			],
		},
	],
};
