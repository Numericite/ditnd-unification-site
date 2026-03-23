import type { Block } from "payload";

export const CalloutBlock: Block = {
	slug: "callout",
	labels: {
		singular: "Mise en avant",
		plural: "Mises en avant",
	},
	fields: [
		{
			name: "title",
			label: { fr: "Titre" },
			type: "text",
			required: false,
			admin: {
				description: "Titre de la mise en avant (optionnel)",
			},
		},
		{
			name: "content",
			label: { fr: "Contenu" },
			type: "textarea",
			required: true,
			validate: (val: string | undefined | null) => {
				if (!val)
					return "Le contenu de la mise en avant est obligatoire";
				return true;
			},
		},
		{
			name: "iconId",
			label: { fr: "Icône" },
			type: "text",
			required: false,
			admin: {
				components: {
					Description:
						"../payload/components/IconIdDescription",
				},
			},
		},
		{
			name: "colorVariant",
			label: { fr: "Couleur d'accentuation" },
			type: "select",
			required: false,
			options: [
				{ label: "Vert", value: "green-emeraude" },
				{ label: "Bleu", value: "blue-ecume" },
			],
			admin: {
				description: "Couleur de la bordure latérale (optionnel)",
			},
		},
	],
};
