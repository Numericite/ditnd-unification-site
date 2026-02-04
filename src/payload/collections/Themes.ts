import type { CollectionConfig } from "payload";
import { standardFields } from "../fields/standards";

export const Themes: CollectionConfig = {
	slug: "themes",
	admin: {
		useAsTitle: "name",
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
	],
};
