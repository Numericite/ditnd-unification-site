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
		{
			name: "altType",
			type: "radio",
			defaultValue: "decorative",
			label: { fr: "Type d'image" },
			options: [
				{ label: "Image décorative", value: "decorative" },
				{ label: "Image non décorative", value: "nonDecorative" },
			],
		},
		{
			name: "alt",
			type: "text",
			label: { fr: "Texte alternatif" },
			validate: (
				value: string | null | undefined,
				{ siblingData }: { siblingData?: { altType?: string } },
			) =>
				siblingData?.altType === "nonDecorative" && !value?.trim()
					? "Le texte alternatif est obligatoire pour une image non décorative."
					: true,
			admin: {
				condition: (_, siblingData) => siblingData?.altType === "nonDecorative",
				components: {
					Field: "../payload/components/ImageAltField",
				},
			},
		},
	],
};
