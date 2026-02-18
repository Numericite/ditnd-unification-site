import type { CollectionConfig } from "payload";

export const PracticalGuideViews: CollectionConfig = {
	slug: "practical-guide-views",
	admin: {
		hidden: false,
	},
	access: {
		read: () => true,
		create: () => true,
		update: () => true,
	},
	fields: [
		{
			name: "guide",
			type: "relationship",
			relationTo: "practical-guides",
			required: true,
			unique: true,
		},
		{
			name: "viewCount",
			type: "number",
			defaultValue: 0,
			required: true,
		},
	],
};
