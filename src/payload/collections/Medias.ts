import type { CollectionConfig } from "payload";
import { ImageSizes } from "~/utils/tools";

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
	upload: {
		adminThumbnail: "og",
		focalPoint: true,
		imageSizes: ImageSizes,
	},
};
