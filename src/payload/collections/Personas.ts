import type { CollectionConfig } from "payload";
import { standardFields } from "../fields/standards";

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
		standardFields.description,
		{
			name: "displayName",
			type: "text",
			required: false,
			label: { fr: "Je suis" },
			admin: {
				description:
					"Texte affiché après 'Je suis' sur les tuiles (optionnel). Ex: 'une personne concernée'. Si vide, le nom du persona sera utilisé.",
			},
		},
		{
			name: "journeyIntro",
			type: "text",
			required: false,
			label: { fr: "Phrase d'intro du parcours" },
			admin: {
				description:
					"Phrase affichée en titre sur la page parcours (optionnel). Ex: 'Je suis un parent interessé par le'",
			},
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
