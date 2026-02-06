import type { CollectionConfig } from "payload";
import { standardFields } from "../fields/standards";

export const Courses: CollectionConfig = {
	slug: "courses",
	admin: {
		useAsTitle: "title",
	},
	labels: {
		singular: "Formation",
		plural: "Formations",
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			label: { fr: "Titre" },
		},
		standardFields.description,
		{
			name: "link",
			type: "text",
			required: true,
			label: { fr: "Lien externe" },
		},
		{
			name: "type",
			type: "select",
			required: true,
			label: { fr: "Type de ressource" },
			options: ["MOOC", "Webinaire", "Présentiel"],
		},
		{
			name: "theme",
			type: "relationship",
			required: true,
			relationTo: "themes",
			label: { fr: "Thèmes" },
		},
		{
			name: "persona",
			type: "relationship",
			required: true,
			relationTo: "personas",
			label: { fr: "Persona" },
		},
		{
			name: "condition",
			type: "relationship",
			required: true,
			relationTo: "conditions",
			label: { fr: "Trouble du neurodéveloppement" },
		},
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image de la formation" },
		},
	],
};
