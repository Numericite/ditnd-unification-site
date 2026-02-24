import type { CollectionConfig } from "payload";
import { standardFields } from "../fields/standards";
import { validateHexColor } from "~/utils/tools";

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
			required: true,
			admin: {
				components: {
					Field: { path: "../payload/components/ColorPicker" },
				},
			},
			validate: (value: unknown) => validateHexColor(value),
		},
		{
			name: "backgroundColor",
			type: "text",
			label: "Couleur de fond",
			defaultValue: "#F4F5F0",
			required: true,
			admin: {
				components: {
					Field: { path: "../payload/components/ColorPicker" },
				},
			},
			validate: (value: unknown) => validateHexColor(value),
		},
	],
};
