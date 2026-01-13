import type { CollectionConfig } from "payload";

export const Journeys: CollectionConfig = {
	slug: "journeys",
	admin: {
		useAsTitle: "journey_name",
	},
	labels: {
		singular: "Parcours",
		plural: "Parcours",
	},
	fields: [
		{
			name: "journey_name",
			label: "Name of your journey",
			type: "text",
			required: true,
		},
		{
			name: "persona",
			type: "relationship",
			relationTo: "personas",
			required: true,
		},
		{
			name: "chapter",
			type: "array",
			required: true,
			fields: [
				{
					name: "chapter-name",
					type: "text",
					required: true,
				},
				{
					name: "practical-guides",
					type: "relationship",
					relationTo: "practical-guides",
					required: true,
					hasMany: true,
				},
				{
					name: "courses",
					type: "relationship",
					relationTo: "courses",
					required: true,
					hasMany: true,
				},
			],
		},
	],
};
