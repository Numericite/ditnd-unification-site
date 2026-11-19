import type { CollectionConfig } from "payload";

export const Journeys: CollectionConfig = {
	slug: "journeys",
	admin: {
		useAsTitle: "journey_name",
		group: { fr: "Contenus" },
	},
	labels: {
		singular: "Parcours",
		plural: "Parcours",
	},
	fields: [
		{
			name: "journey_name",
			type: "text",
			required: true,
			label: { fr: "Nom de votre parcours" },
		},
		{
			name: "persona",
			type: "relationship",
			relationTo: "personas",
			required: true,
			label: { fr: "Persona" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "image",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Image du parcours" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "practicalGuideDescription",
			type: "textarea",
			required: false,
			label: { fr: "Description de l'onglet \"Je m'informe\"" },
		},
		{
			name: "courseDescription",
			type: "textarea",
			required: false,
			label: { fr: 'Description de l\'onglet "Je me forme"' },
		},
		{
			name: "conditionTexts",
			type: "array",
			label: { fr: "Textes par trouble" },
			labels: { singular: "Texte par trouble", plural: "Textes par trouble" },
			admin: {
				description:
					"Titre et description affichés en tête de la page parcours pour un trouble donné. Sans ligne pour un trouble, le titre et la description sont générés automatiquement.",
				initCollapsed: true,
				components: {
					RowLabel: "../payload/components/ConditionTextRowLabel",
				},
			},
			validate: (value: unknown) => {
				if (!Array.isArray(value)) return true;
				const ids = value
					.map((row) => {
						const condition = (row as { condition?: unknown }).condition;
						return typeof condition === "object" && condition !== null
							? (condition as { id: unknown }).id
							: condition;
					})
					.filter((id) => id !== null && id !== undefined);
				return new Set(ids).size === ids.length
					? true
					: "Chaque trouble ne peut avoir qu'un seul texte.";
			},
			fields: [
				{
					name: "condition",
					type: "relationship",
					relationTo: "conditions",
					required: true,
					label: { fr: "Trouble" },
				},
				{
					name: "title",
					type: "text",
					required: true,
					label: { fr: "Titre" },
				},
				{
					name: "description",
					type: "textarea",
					required: true,
					label: { fr: "Description" },
				},
			],
		},
		{
			name: "chapter",
			type: "array",
			required: true,
			label: { fr: "Chapitres" },
			labels: { plural: "Chapitres", singular: "Chapitre" },
			fields: [
				{
					name: "chapter-name",
					type: "text",
					required: true,
					label: { fr: "Nom du chapitre" },
				},
				{
					name: "practical-guides",
					type: "relationship",
					relationTo: "practical-guides",
					required: true,
					hasMany: true,
					label: { fr: "Fiches pratiques" },
				},
				{
					name: "courses",
					type: "relationship",
					relationTo: "courses",
					hasMany: true,
					label: { fr: "Formations" },
				},
			],
		},
	],
};
