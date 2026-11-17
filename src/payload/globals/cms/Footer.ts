import type { GlobalConfig } from "payload";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";
import { standardFields } from "~/payload/fields/standards";
import { menuLinkField } from "~/payload/fields/menuLink";
import {
	FOOTER_LOCKED_LINKS_AFTER,
	FOOTER_LOCKED_LINKS_BEFORE,
} from "~/utils/footer";

const imageBannerField = {
	name: "imageBanner",
	type: "upload",
	relationTo: "medias",
	required: false,
	label: { fr: "Image de la bannière" },
} as const;

export const CMSFooter: GlobalConfig = {
	slug: "footer",
	label: "Footer",
	admin: {
		group: { fr: "Pages" },
		hidden: hideForNonAdmin,
	},
	access: {
		read: isAdmin,
		update: isAdmin,
	},
	fields: [
		standardFields.title,
		{
			type: "tabs",
			tabs: [
				{
					label: "Liens du bas de page",
					fields: [
						{
							name: "bottomLinks",
							type: "array",
							label: { fr: "Liens du bas de page" },
							labels: {
								singular: { fr: "Lien" },
								plural: { fr: "Liens" },
							},
							admin: {
								initCollapsed: true,
								description:
									"Les liens fixes sont imposés (obligations légales, accessibilité, DSFR). Les modifications apparaissent sur le site sous une minute.",
								components: {
									RowLabel: "../payload/components/ArrayRowLabel",
									beforeInput: [
										{
											path: "../payload/components/LockedRows",
											clientProps: { items: FOOTER_LOCKED_LINKS_BEFORE },
										},
									],
									afterInput: [
										{
											path: "../payload/components/LockedRows",
											clientProps: { items: FOOTER_LOCKED_LINKS_AFTER },
										},
									],
								},
							},
							fields: [
								{
									name: "title",
									type: "text",
									required: true,
									label: { fr: "Libellé" },
								},
								menuLinkField,
							],
						},
					],
				},
				{
					label: "Accessibilité",
					name: "accessibility",
					fields: [standardFields.title, standardFields.wysiwyg],
				},
				{
					label: "Mentions légales",
					name: "legalNotice",
					fields: [standardFields.title, standardFields.wysiwyg],
				},
				{
					label: "Contact professionnels",
					name: "contactProsCra",
					fields: [
						standardFields.title,
						imageBannerField,
						standardFields.wysiwyg,
					],
				},
				{
					label: "Contact particuliers",
					name: "contactParticuliers",
					fields: [
						standardFields.title,
						imageBannerField,
						standardFields.wysiwyg,
					],
				},
			],
		},
	],
};
