import type { CollectionConfig } from "payload";
import { hideForNonAdmin, isAdmin } from "../hooks";

export const GlossaryCategories: CollectionConfig = {
	slug: "glossary-categories",
	admin: {
		useAsTitle: "name",
		group: { fr: "Glossaire" },
		defaultColumns: ["name"],
		hidden: hideForNonAdmin,
	},
	access: {
		create: isAdmin,
		update: isAdmin,
		delete: isAdmin,
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
