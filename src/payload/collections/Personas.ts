import type { CollectionConfig } from "payload";
import { standardFields } from "../fields/standards";

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
		standardFields.description,
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
			options: ["Avatar", "HumanCooperation", "CityHall", "SelfTraining"],
			label: { fr: "Pictogramme du Persona" },
		},
	],
};
