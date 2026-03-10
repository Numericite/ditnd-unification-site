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
			validate: (val: string | undefined | null) => {
				if (!val) return "L'image est obligatoire";
				return true;
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
				{ label: "Miniature", value: "thumbnail" },
				{ label: "Carré", value: "square" },
				{ label: "Petite", value: "small" },
				{ label: "Moyenne", value: "medium" },
				{ label: "Large", value: "large" },
			],
		},
	],
};
