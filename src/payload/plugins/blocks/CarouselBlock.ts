import type { Block } from "payload";

export const CarouselBlock: Block = {
	slug: "carousel",
	labels: {
		singular: "Carrousel de cartes",
		plural: "Carrousels de cartes",
	},
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "title",
					label: { fr: "Titre" },
					type: "text",
					required: false,
					admin: {
						width: "70%",
						description:
							"Optionnel. Laisser vide si un intertitre précède déjà le carrousel.",
					},
				},
				{
					name: "titleAs",
					label: { fr: "Niveau de titre" },
					type: "select",
					required: false,
					defaultValue: "h3",
					options: [
						{ label: "Titre 2 (h2)", value: "h2" },
						{ label: "Titre 3 (h3)", value: "h3" },
						{ label: "Titre 4 (h4)", value: "h4" },
						{ label: "Titre 5 (h5)", value: "h5" },
						{ label: "Titre 6 (h6)", value: "h6" },
					],
					admin: {
						width: "30%",
						condition: (_, siblingData) => Boolean(siblingData?.title),
					},
				},
			],
		},
		{
			name: "items",
			label: { fr: "Cartes" },
			type: "relationship",
			relationTo: ["practical-guides", "courses"],
			hasMany: true,
			required: true,
			minRows: 2,
			admin: {
				description:
					"Fiches pratiques et formations à afficher côte à côte, dans cet ordre. Faites-les glisser pour les réordonner.",
			},
		},
	],
};
