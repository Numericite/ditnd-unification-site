import type { Block } from "payload";

export const LANG_OPTIONS = [
	{ label: "Anglais", value: "en" },
	{ label: "Allemand", value: "de" },
	{ label: "Espagnol", value: "es" },
	{ label: "Italien", value: "it" },
	{ label: "Latin", value: "la" },
] as const;

export const LangBlock: Block = {
	slug: "lang",
	labels: {
		singular: "Terme en langue étrangère",
		plural: "Termes en langue étrangère",
	},
	fields: [
		{
			name: "text",
			label: { fr: "Texte" },
			type: "text",
			required: true,
			admin: {
				description: "Le terme tel qu'il doit apparaître dans la page",
			},
		},
		{
			name: "lang",
			label: { fr: "Langue" },
			type: "select",
			required: true,
			options: [...LANG_OPTIONS],
			admin: {
				description:
					"Code de langue ajouté en attribut lang sur le texte (RGAA 8.7)",
			},
		},
	],
};
