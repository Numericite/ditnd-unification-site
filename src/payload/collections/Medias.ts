import type { CollectionConfig } from "payload";

export const Medias: CollectionConfig = {
	slug: "medias",
	defaultPopulate: {
		url: true,
		filename: true,
		width: true,
		height: true,
		alt: true,
	},
	labels: {
		singular: "Media",
		plural: "Medias",
	},
	access: {
		read: () => true,
	},
	fields: [
		{
			name: "alt",
			type: "text",
			required: true,
		},
	],
	upload: true,
};
