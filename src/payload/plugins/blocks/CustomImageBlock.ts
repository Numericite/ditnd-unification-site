import type { Block } from "payload";

export const CustomImageBlock: Block = {
	slug: "image",
	labels: {
		singular: "Image custom",
		plural: "Images custom",
	},
	fields: [
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: true,
			label: { fr: "Image" },
			admin: {
				description:
					"Sélectionnez ou téléchargez une image depuis la bibliothèque de médias",
			},
		},
		{
			name: "size",
			type: "select",
			required: true,
			defaultValue: "medium",
			label: { fr: "Taille" },
			admin: {
				description: "Choisissez la taille d'affichage de l'image",
			},
			options: [
				{ label: "Miniature (300px)", value: "thumbnail" },
				{ label: "Carré (500px)", value: "square" },
				{ label: "Petit (600px)", value: "small" },
				{ label: "Moyen (900px)", value: "medium" },
				{ label: "Grand (1400px)", value: "large" },
			],
		},
		{
			name: "alignment",
			type: "select",
			defaultValue: "center",
			label: { fr: "Alignement" },
			options: [
				{ label: "Gauche", value: "left" },
				{ label: "Centre", value: "center" },
				{ label: "Droite", value: "right" },
			],
		},
	],
};
