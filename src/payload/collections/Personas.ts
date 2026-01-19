import type { CollectionConfig } from "payload";

export const Personas: CollectionConfig = {
	slug: "personas",
	admin: {
		useAsTitle: "name",
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
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			label: { fr: "Identifiant texte" },
		},
	],
};
