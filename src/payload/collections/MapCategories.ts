import type { CollectionBeforeDeleteHook, CollectionConfig } from "payload";
import { APIError } from "payload";
import { dsfrAccentColors } from "~/utils/dsfr-colors";

const beforeDeleteMapCategory: CollectionBeforeDeleteHook = async ({
	id,
	req,
}) => {
	const { totalDocs } = await req.payload.count({
		collection: "map-markers",
		where: { category: { equals: id } },
		req,
	});
	if (totalDocs > 0) {
		throw new APIError(
			`Impossible de supprimer cette catégorie : ${totalDocs} point(s) de carte y sont rattachés.`,
			400,
		);
	}
};

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
	hooks: {
		beforeDelete: [beforeDeleteMapCategory],
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: { fr: "Nom" },
			admin: {
				description: "Nom affiché dans la légende des cartes.",
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
		{
			name: "customFields",
			type: "array",
			label: { fr: "Champs personnalisés" },
			labels: {
				singular: "Champ",
				plural: "Champs",
			},
			admin: {
				description:
					"Champs supplémentaires affichés dans les formulaires des marqueurs de cette catégorie.",
				initCollapsed: true,
			},
			fields: [
				{
					type: "row",
					fields: [
						{
							name: "label",
							type: "text",
							required: true,
							label: { fr: "Libellé" },
							admin: { width: "50%" },
						},
						{
							name: "key",
							type: "text",
							required: true,
							label: { fr: "Identifiant (clé)" },
							admin: {
								width: "50%",
								description: "Identifiant unique, sans espaces.",
							},
						},
					],
				},
				{
					name: "type",
					type: "select",
					required: true,
					defaultValue: "text",
					label: { fr: "Type de champ" },
					options: [
						{ label: "Case à cocher", value: "checkbox" },
						{ label: "Texte", value: "text" },
						{ label: "Liste de choix", value: "select" },
					],
				},
				{
					name: "options",
					type: "array",
					label: { fr: "Options" },
					labels: {
						singular: "Option",
						plural: "Options",
					},
					admin: {
						condition: (_, siblingData) => siblingData?.type === "select",
						description: "Options disponibles pour ce champ de type liste.",
					},
					fields: [
						{
							type: "row",
							fields: [
								{
									name: "label",
									type: "text",
									required: true,
									label: { fr: "Libellé" },
									admin: { width: "50%" },
								},
								{
									name: "value",
									type: "text",
									required: true,
									label: { fr: "Valeur" },
									admin: { width: "50%" },
								},
							],
						},
					],
				},
			],
		},
	],
};
