import type { Block } from "payload";

export const CustomImageBlock: Block = {
	slug: "image",
	labels: {
		singular: "Image",
		plural: "Images",
	},
	fields: [
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: true,
			label: { fr: "Image" },
		},
		{
			name: "size",
			type: "select",
			required: true,
			defaultValue: "medium",
			label: { fr: "Taille" },
			options: [
				{ label: "Miniature", value: "thumbnail" },
				{ label: "Carré", value: "square" },
				{ label: "Petite", value: "small" },
				{ label: "Moyenne", value: "medium" },
				{ label: "Large", value: "large" },
				{ label: "Largeur complète", value: "full" },
				{ label: "Custom", value: "custom" },
			],
		},
		{
			name: "customWidth",
			type: "number",
			label: { fr: "Largeur (px)" },
			admin: {
				condition: (_, siblingData) => siblingData?.size === "custom",
				width: "50%",
			},
		},
		{
			name: "customHeight",
			type: "number",
			label: { fr: "Hauteur (px)" },
			admin: {
				condition: (_, siblingData) => siblingData?.size === "custom",
				width: "50%",
			},
		},
	],
};
