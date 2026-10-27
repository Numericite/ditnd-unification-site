import type { Field, GlobalConfig } from "payload";
import { menuLinkField } from "~/payload/fields/menuLink";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";

const titleField: Field = {
	name: "title",
	type: "text",
	required: true,
	label: { fr: "Libellé" },
};

const rowLabel = { RowLabel: "../payload/components/ArrayRowLabel" };

export const CMSMenu: GlobalConfig = {
	slug: "menu",
	label: "Menu principal",
	admin: {
		group: { fr: "Pages" },
		hidden: hideForNonAdmin,
		description:
			"Liens de la barre de navigation, affichés après les éléments fixes. Les modifications apparaissent sur le site sous une minute.",
	},
	access: {
		read: isAdmin,
		update: isAdmin,
	},
	fields: [
		{
			name: "items",
			type: "array",
			label: { fr: "Éléments du menu" },
			labels: {
				singular: { fr: "Élément" },
				plural: { fr: "Éléments" },
			},
			admin: {
				initCollapsed: true,
				components: {
					...rowLabel,
					beforeInput: ["../payload/components/MenuLockedItems"],
				},
			},
			fields: [
				titleField,
				{
					name: "kind",
					type: "radio",
					required: true,
					defaultValue: "link",
					label: { fr: "Type d'élément" },
					options: [
						{ label: "Lien", value: "link" },
						{ label: "Sous-menu", value: "submenu" },
					],
					admin: { layout: "horizontal" },
				},
				{
					...menuLinkField,
					admin: {
						condition: (_, siblingData) => siblingData?.kind === "link",
					},
				},
				{
					name: "children",
					type: "array",
					label: { fr: "Liens du sous-menu" },
					labels: {
						singular: { fr: "Lien" },
						plural: { fr: "Liens" },
					},
					minRows: 1,
					admin: {
						initCollapsed: true,
						condition: (_, siblingData) => siblingData?.kind === "submenu",
						components: rowLabel,
					},
					fields: [titleField, menuLinkField],
				},
			],
		},
	],
};
