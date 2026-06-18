import type { CollectionConfig } from "payload";
import { BASEMAP_OPTIONS, DEFAULT_BASEMAP } from "~/utils/map-basemaps";

export const Maps: CollectionConfig = {
	slug: "maps",
	admin: {
		useAsTitle: "name",
		defaultColumns: ["name", "slug", "categories"],
		group: "Cartographie",
		description:
			"Cartes composées d'une ou plusieurs catégories de points. Une carte peut être insérée dans un contenu via le bloc « Carte ».",
	},
	labels: {
		singular: "Carte",
		plural: "Cartes",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: { fr: "Nom interne" },
			admin: {
				description:
					"Nom utilisé en interne pour retrouver la carte (non affiché).",
			},
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			label: { fr: "Identifiant texte" },
		},
		{
			name: "title",
			type: "text",
			required: false,
			label: { fr: "Titre affiché" },
			admin: {
				description:
					"Titre optionnel affiché au-dessus de la carte. Si vide, la carte s'affiche sans titre.",
			},
		},
		{
			name: "description",
			type: "textarea",
			required: false,
			label: { fr: "Description" },
		},
		{
			name: "basemap",
			type: "select",
			required: true,
			defaultValue: DEFAULT_BASEMAP,
			label: { fr: "Fond de carte" },
			options: BASEMAP_OPTIONS,
			admin: {
				description:
					"Fond de carte Géoplateforme IGN. Le Plan IGN reste le plus lisible pour repérer une adresse ; les photographies aériennes n'affichent pas les noms de rue.",
			},
		},
		{
			name: "categories",
			type: "relationship",
			relationTo: "map-categories",
			hasMany: true,
			required: true,
			label: { fr: "Catégories affichées" },
			admin: {
				description:
					"Toutes les catégories sélectionnées seront affichées sur la carte avec leurs marqueurs.",
			},
		},
		{
			name: "enableClustering",
			type: "checkbox",
			defaultValue: true,
			label: { fr: "Regrouper les marqueurs proches (clusters)" },
			admin: {
				description:
					"Regroupe les marqueurs proches en clusters colorés selon leurs catégories. Le détail se déploie au zoom.",
			},
		},
		{
			type: "collapsible",
			label: { fr: "Filtres autorisés" },
			admin: {
				description:
					"Choisissez quels filtres sont disponibles sur cette carte. Si aucun filtre n'est activé, le module de filtrage ne s'affichera pas.",
			},
			fields: [
				{
					name: "allowFilterByCategory",
					type: "checkbox",
					defaultValue: true,
					label: { fr: "Filtre par catégorie" },
				},
				{
					name: "allowFilterByRegion",
					type: "checkbox",
					defaultValue: true,
					label: { fr: "Filtre par région" },
				},
				{
					name: "allowFilterByDepartement",
					type: "checkbox",
					defaultValue: true,
					label: { fr: "Filtre par département" },
				},
				{
					name: "allowedCustomFieldFilters",
					type: "json",
					defaultValue: [],
					label: { fr: "Filtres par champs personnalisés" },
					admin: {
						description:
							"Activez les champs personnalisés (case à cocher ou liste) qui seront disponibles comme filtres sur cette carte.",
						components: {
							Field: "../payload/components/CustomFieldFiltersEditor",
						},
					},
				},
			],
		},
		{
			type: "collapsible",
			label: { fr: "Cadrage par défaut" },
			admin: { initCollapsed: true },
			fields: [
				{
					type: "row",
					fields: [
						{
							name: "defaultLatitude",
							type: "number",
							required: false,
							defaultValue: 46.6,
							label: { fr: "Latitude du centre" },
							admin: { width: "33%" },
						},
						{
							name: "defaultLongitude",
							type: "number",
							required: false,
							defaultValue: 2.3,
							label: { fr: "Longitude du centre" },
							admin: { width: "33%" },
						},
						{
							name: "defaultZoom",
							type: "number",
							required: false,
							defaultValue: 5,
							min: 1,
							max: 18,
							label: { fr: "Niveau de zoom" },
							admin: { width: "34%" },
						},
					],
				},
				{
					name: "fitToMarkers",
					type: "checkbox",
					defaultValue: true,
					label: { fr: "Ajuster automatiquement aux marqueurs" },
					admin: {
						description:
							"Si activé, le cadrage par défaut est ignoré quand des marqueurs existent.",
					},
				},
			],
		},
	],
};
