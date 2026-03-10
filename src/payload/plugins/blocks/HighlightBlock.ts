import type { Block } from "payload";

export const HighlightBlock: Block = {
	slug: "highlight",
	labels: {
		singular: "Mise en exergue",
		plural: "Mises en exergue",
	},
	fields: [
		{
			name: "content",
			label: { fr: "Contenu" },
			type: "textarea",
			required: true,
			validate: (val: string | undefined | null) => {
				if (!val)
					return "Le contenu de la mise en exergue est obligatoire";
				return true;
			},
		},
		{
			name: "size",
			label: { fr: "Taille" },
			type: "select",
			defaultValue: "md",
			options: [
				{ label: "Petit", value: "sm" },
				{ label: "Moyen", value: "md" },
				{ label: "Grand", value: "lg" },
			],
		},
	],
};
