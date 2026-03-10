import type { Block } from "payload";

export const CitationBlock: Block = {
	slug: "citation",
	labels: {
		singular: "Citation",
		plural: "Citations",
	},
	fields: [
		{
			name: "quote",
			label: { fr: "Texte de la citation" },
			type: "textarea",
			required: true,
			validate: (val: string | undefined | null) => {
				if (!val) return "Le texte de la citation est obligatoire";
				return true;
			},
		},
		{
			name: "author",
			label: { fr: "Auteur" },
			type: "text",
			required: false,
			admin: {
				description: "Nom de l'auteur de la citation (optionnel)",
			},
		},
		{
			name: "source",
			label: { fr: "Source" },
			type: "text",
			required: false,
			admin: {
				description:
					"Source ou référence de la citation (optionnel)",
			},
		},
	],
};
