import type { CollectionConfig } from "payload";
import { validateHttpUrl } from "../fields/validateHttpUrl";
import { geocodeMarker } from "../hooks/geocodeMarker";

export const MapMarkers: CollectionConfig = {
	slug: "map-markers",
	admin: {
		useAsTitle: "name",
		defaultColumns: ["name", "category", "city", "latitude", "longitude"],
		group: "Cartographie",
		description:
			"Points géolocalisés rattachés à une catégorie. Les coordonnées sont remplies automatiquement à partir de l'adresse via api-adresse.data.gouv.fr.",
		components: {
			beforeListTable: ["../payload/components/MapMarkersImportLink"],
		},
	},
	labels: {
		singular: "Point de carte",
		plural: "Points de carte",
	},
	hooks: {
		beforeChange: [geocodeMarker],
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: { fr: "Nom" },
		},
		{
			name: "category",
			type: "relationship",
			relationTo: "map-categories",
			required: true,
			label: { fr: "Catégorie" },
		},
		{
			type: "row",
			fields: [
				{
					name: "address",
					type: "text",
					required: true,
					label: { fr: "Adresse" },
					admin: { width: "60%" },
				},
				{
					name: "postalCode",
					type: "text",
					required: false,
					label: { fr: "Code postal" },
					admin: { width: "20%" },
				},
				{
					name: "city",
					type: "text",
					required: true,
					label: { fr: "Ville" },
					admin: { width: "20%" },
				},
			],
		},
		{
			type: "row",
			fields: [
				{
					name: "latitude",
					type: "number",
					required: false,
					label: { fr: "Latitude" },
					admin: {
						width: "50%",
						description:
							"Rempli automatiquement à partir de l'adresse. Modifiable pour ajuster manuellement.",
					},
				},
				{
					name: "longitude",
					type: "number",
					required: false,
					label: { fr: "Longitude" },
					admin: {
						width: "50%",
						description:
							"Rempli automatiquement à partir de l'adresse. Modifiable pour ajuster manuellement.",
					},
				},
			],
		},
		{
			type: "collapsible",
			label: { fr: "Coordonnées de contact" },
			admin: { initCollapsed: true },
			fields: [
				{
					name: "phone",
					type: "text",
					required: false,
					label: { fr: "Téléphone" },
				},
				{
					name: "email",
					type: "email",
					required: false,
					label: { fr: "E-mail" },
				},
				{
					name: "website",
					type: "text",
					required: false,
					label: { fr: "Site web" },
					validate: validateHttpUrl,
				},
			],
		},
		{
			name: "description",
			type: "textarea",
			required: false,
			label: { fr: "Description" },
			admin: {
				description:
					"Description affichée dans l'infobulle du point sur la carte.",
			},
		},
		{
			name: "metadata",
			type: "json",
			label: { fr: "Informations complémentaires" },
			admin: {
				description:
					"Champs supplémentaires définis dans la catégorie de ce marker.",
				components: {
					Field: "../payload/components/MetadataField",
				},
			},
		},
	],
};
