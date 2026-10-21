import type { CollectionConfig } from "payload";
import { standardFields } from "../fields/standards";
import { slugField } from "../fields/slug";
import { validatePageSlug } from "../fields/validatePageSlug";

export const Pages: CollectionConfig = {
	slug: "pages",
	admin: {
		useAsTitle: "title",
		group: { fr: "Contenus" },
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
			name: "imageBanner",
			type: "upload",
			relationTo: "medias",
			required: false,
			label: { fr: "Bannière" },
			admin: {
				position: "sidebar",
			},
		},
		slugField("pages", { editable: true, validate: validatePageSlug }),
	],
};
