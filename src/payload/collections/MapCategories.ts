import type { CollectionConfig } from "payload";
import { dsfrAccentColors } from "~/utils/dsfr-colors";

export const MapCategories: CollectionConfig = {
	slug: "map-categories",
	admin: {
		useAsTitle: "name",
		defaultColumns: ["name", "slug", "colorVariant"],
		group: "Cartographie",
		description:
			"Types de points géolocalisés (ex : MDPH, CRA). Chaque catégorie regroupe une famille de marqueurs qui pourra être affichée sur une ou plusieurs cartes.",
	},
	labels: {
		singular: "Catégorie de carte",
		plural: "Catégories de carte",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: { fr: "Nom" },
			admin: {
				description:
					"Nom affiché dans la légende des cartes (ex : « MDPH », « CRA »).",
			},
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			label: { fr: "Identifiant texte" },
			admin: {
				description: "Identifiant stable utilisé en interne (kebab-case).",
			},
		},
		{
			name: "colorVariant",
			type: "select",
			required: false,
			label: { fr: "Couleur des marqueurs" },
			options: [...dsfrAccentColors],
			admin: {
				description: "Couleur DSFR appliquée aux marqueurs de cette catégorie.",
			},
		},
		{
			name: "iconId",
			type: "text",
			required: false,
			label: { fr: "Icône" },
			admin: {
				description:
					"Identifiant d'icône DSFR (ex : fr-icon-map-pin-2-fill). Facultatif.",
				components: {
					Description: "../payload/components/IconIdDescription",
				},
			},
		},
		{
			name: "description",
			type: "textarea",
			required: false,
			label: { fr: "Description" },
		},
	],
};
