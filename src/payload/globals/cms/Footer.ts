import type { GlobalConfig } from "payload";
import { standardFields } from "~/payload/fields/standards";

export const CMSFooter: GlobalConfig = {
	slug: "footer",
	label: "CMS - Footer",
	fields: [
		standardFields.title,
		{
			type: "tabs",
			tabs: [
				{
					label: "Accessibilité",
					name: "accessibility",
					fields: [standardFields.title, standardFields.wysiwyg],
				},
				{
					label: "Mention légales",
					name: "legalNotice",
					fields: [standardFields.title, standardFields.wysiwyg],
				},
				{
					label: "Politique de confidentialité",
					name: "cgu",
					fields: [standardFields.title, standardFields.wysiwyg],
				},
				{
					label: "Modalités d'utilisation",
					name: "termsOfUse",
					fields: [standardFields.title, standardFields.wysiwyg],
				},
			],
		},
	],
};
