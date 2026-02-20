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
		},
		{
			name: "size",
			type: "select",
			required: true,
			defaultValue: "medium",
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
