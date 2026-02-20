import type { CollectionConfig } from "payload";
import { standardFields } from "../fields/standards";

export const Conditions: CollectionConfig = {
	slug: "conditions",
	admin: {
		useAsTitle: "name",
	},
	labels: {
		singular: "Trouble du neurodéveloppement",
		plural: "Troubles du neurodéveloppement",
	},
	orderable: true,
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: { fr: "Nom" },
		},
		standardFields.description,
		{
			name: "acronym",
			type: "text",
			required: true,
			label: { fr: "Acronyme" },
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			label: { fr: "Identifiant texte" },
		},
		{
			name: "textColor",
			type: "text",
			label: "Couleur du texte",
			defaultValue: "#162316",
			admin: {
				components: {
					Field: { path: "../payload/components/ColorPicker" },
				},
			},
			validate: (value: unknown) => {
				if (typeof value !== "string" || value.length === 0) return true;
				return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
					? true
					: "Format de couleur invalide. Utilisez le format #RRGGBB ou #RGB.";
			},
		},
		{
			name: "backgroundColor",
			type: "text",
			label: "Couleur de fond",
			defaultValue: "#F4F5F0",
			admin: {
				components: {
					Field: { path: "../payload/components/ColorPicker" },
				},
			},
			validate: (value: unknown) => {
				if (typeof value !== "string" || value.length === 0) return true;
				return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
					? true
					: "Format de couleur invalide. Utilisez le format #RRGGBB ou #RGB.";
			},
		},
	],
};
