import type { CollectionConfig } from "payload";

export const GlossaryCategories: CollectionConfig = {
	slug: "glossary-categories",
	admin: {
		useAsTitle: "name",
		group: { fr: "Glossaire" },
		defaultColumns: ["name"],
	},
	labels: {
		singular: "Catégorie du glossaire",
		plural: "Catégories du glossaire",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			unique: true,
			label: { fr: "Nom" },
		},
	],
};
