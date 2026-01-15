import type { CollectionConfig } from "payload";

export const Conditions: CollectionConfig = {
	slug: "conditions",
	admin: {
		useAsTitle: "name",
	},
	labels: {
		singular: "Trouble du neurodéveloppement",
		plural: "Troubles du neurodéveloppement",
	},
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
			name: "acronym",
			type: "text",
			required: true,
			label: { fr: "Acronyme" },
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			label: { fr: "Jeton" },
		},
		{
			name: "textColor",
			type: "text",
			required: true,
			label: { fr: "Couleur du texte" },
		},
		{
			name: "backgroundColor",
			type: "text",
			required: true,
			label: { fr: "Couleur de fond" },
		},
	],
};
