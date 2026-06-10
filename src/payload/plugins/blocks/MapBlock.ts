import type { Block } from "payload";

export const MapBlock: Block = {
	slug: "map",
	labels: {
		singular: "Carte",
		plural: "Cartes",
	},
	fields: [
		{
			name: "map",
			label: { fr: "Carte à insérer" },
			type: "relationship",
			relationTo: "maps",
			required: true,
		},
		{
			name: "height",
			label: { fr: "Hauteur (px)" },
			type: "number",
			required: false,
			defaultValue: 480,
			min: 240,
			max: 1200,
			admin: {
				description: "Hauteur de la carte en pixels (entre 240 et 1200).",
			},
		},
	],
};
