import type { CollectionConfig } from "payload";
import { standardFields } from "../fields/standards";
import { slugField } from "../fields/slug";
import { validatePageSlug } from "../fields/validatePageSlug";

export const Pages: CollectionConfig = {
	slug: "pages",
	admin: {
		useAsTitle: "title",
		group: { fr: "Contenus" },
		defaultColumns: ["title", "section", "_status", "updatedAt"],
	},
	labels: {
		singular: "Page",
		plural: "Pages",
	},
	versions: {
		drafts: {
			autosave: {
				interval: 2000,
				showSaveDraftButton: true,
			},
		},
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: { fr: "Contenu" },
					fields: [
						{
							name: "title",
							type: "text",
							required: true,
							label: { fr: "Titre" },
							admin: {
								description:
									"Titre complet affiché en haut de la page et dans le fil d'Ariane. Sert aussi de titre SEO si aucun n'est renseigné.",
							},
						},
						standardFields.wysiwyg,
					],
				},
			],
		},
		{
			name: "publishedAt",
			type: "date",
			required: false,
			label: { fr: "Date de publication" },
			defaultValue: () => new Date().toISOString(),
			admin: {
				position: "sidebar",
				description:
					"Affichée sur le site à côté de « Publié le ». Par défaut, la date de création de la page.",
				date: {
					displayFormat: "dd/MM/yyyy",
				},
			},
		},
		{
			name: "lastUpdatedAt",
			type: "date",
			required: false,
			label: { fr: "Date de mise à jour" },
			admin: {
				position: "sidebar",
				description:
					"Facultative. Si renseignée, une mention « Mis à jour le » est affichée sur le site.",
				date: {
					displayFormat: "dd/MM/yyyy",
				},
			},
		},
		{
			name: "showDates",
			type: "checkbox",
			defaultValue: true,
			label: { fr: "Afficher les dates de publication et de mise à jour" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "imageBanner",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Bannière" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "section",
			type: "relationship",
			relationTo: "page-sections",
			label: { fr: "Rubrique" },
			admin: {
				position: "sidebar",
				description:
					"Facultative. Une page rangée dans une rubrique est accessible sur /{rubrique}/{identifiant}, et la rubrique apparaît dans son fil d'Ariane. La modifier change l'URL publique : pensez à ajouter une redirection.",
			},
		},
		{
			name: "module",
			type: "select",
			label: { fr: "Module intégré" },
			options: [
				{
					label: "Formulaire de contact des particuliers",
					value: "contact-particuliers",
				},
				{
					label: "Formulaire de contact des professionnels des CRA",
					value: "contact-pros-cra",
				},
			],
			admin: {
				position: "sidebar",
				description: "Facultatif. Affiché sous le contenu de la page.",
			},
		},
		slugField("pages", { editable: true, validate: validatePageSlug }),
	],
};
