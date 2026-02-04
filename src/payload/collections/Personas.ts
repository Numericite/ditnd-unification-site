import type { CollectionConfig } from "payload";

export const Personas: CollectionConfig = {
	slug: "personas",
	admin: {
		useAsTitle: "name",
	},
	orderable: true,
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: { fr: "Nom" },
		},
		{
			name: "description",
			type: "text",
			required: true,
			label: { fr: "Description" },
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			label: { fr: "Identifiant texte" },
		},
		{
			name: "pictogram",
			type: "select",
			required: false,
			options: [
				"Avatar",
				"HumanCooperation",
				"CityHall",
				"SelfTraining",
				"Hospital",
				"School",
				"Companie",
				"Ecosystem",
			],
			label: { fr: "Pictogramme du Persona" },
		},
	],
};
