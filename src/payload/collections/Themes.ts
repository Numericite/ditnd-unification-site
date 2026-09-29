import type { CollectionConfig } from "payload";
import { standardFields } from "../fields/standards";
import { hideForNonAdmin, isAdmin } from "../hooks";

export const Themes: CollectionConfig = {
	slug: "themes",
	admin: {
		useAsTitle: "name",
		group: { fr: "Taxonomies" },
		hidden: hideForNonAdmin,
	},
	access: {
		create: isAdmin,
		update: isAdmin,
		delete: isAdmin,
	},
	labels: {
		singular: "Thème",
		plural: "Thèmes",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: { fr: "Nom" },
		},
		standardFields.description,
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			label: { fr: "Identifiant texte" },
		},
		{
			name: "isHidden",
			type: "checkbox",
			defaultValue: false,
			label: { fr: "Masquer sur le site" },
			admin: {
				position: "sidebar",
				description:
					"Le thème n'apparaît plus dans les filtres du site, par exemple tant qu'il contient trop peu de fiches.",
			},
		},
		{
			name: "relatedPracticalGuides",
			type: "join",
			collection: "practical-guides",
			on: "themes",
			label: "Fiches pratiques associées",
			admin: {
				position: "sidebar",
				allowCreate: false,
				defaultColumns: ["title", "_status"],
			},
		},
		{
			name: "relatedCourses",
			type: "join",
			collection: "courses",
			on: "theme",
			label: "Formations associées",
			admin: {
				position: "sidebar",
				allowCreate: false,
				defaultColumns: ["title", "_status"],
			},
		},
	],
};
