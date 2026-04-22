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
				description: "Source ou référence de la citation (optionnel)",
			},
		},
		{
			name: "sourceUrl",
			label: { fr: "URL de la source" },
			type: "text",
			required: false,
			admin: {
				description: "Lien vers la source de la citation (optionnel)",
			},
		},
		{
			name: "image",
			label: { fr: "Image" },
			type: "upload",
			relationTo: "medias",
			required: false,
			admin: {
				description: "Image associée à la citation (optionnel)",
			},
		},
		{
			name: "size",
			label: { fr: "Taille" },
			type: "select",
			defaultValue: "medium",
			options: [
				{ label: "Moyen", value: "medium" },
				{ label: "Grand", value: "large" },
				{ label: "Très grand", value: "xlarge" },
			],
		},
	],
};
