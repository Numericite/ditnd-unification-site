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
			type: "tabs",
			tabs: [
				{
					name: "persona",
					fields: [
						{
							name: "persona",
							type: "relationship",
							relationTo: "personas",
							required: true,
						},
						{
							name: "condition",
							type: "relationship",
							relationTo: "conditions",
							required: true,
						},
						{
							name: "chapter",
							type: "array",
							fields: [
								{
									name: "chapter-name",
									type: "text",
									required: true,
								},
								{
									name: "practical-guide-list",
									type: "array",
									required: true,
									fields: [
										{
											name: "practical-guide",
											type: "relationship",
											relationTo: "practical-guides",
											required: true,
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};
