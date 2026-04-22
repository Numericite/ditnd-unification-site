import type { GlobalConfig } from "payload";
import { standardFields } from "~/payload/fields/standards";

const imageBannerField = {
	name: "imageBanner",
	type: "upload",
	relationTo: "medias",
	required: false,
	label: { fr: "Image de la bannière" },
} as const;

export const CMSAbout: GlobalConfig = {
	slug: "about",
	label: "CMS - À propos",
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Maison de l'autisme",
					name: "maisonDeLAutisme",
					fields: [
						standardFields.title,
						imageBannerField,
						standardFields.wysiwyg,
					],
				},
				{
					label: "GNCRA",
					name: "gncra",
					fields: [
						standardFields.title,
						imageBannerField,
						standardFields.wysiwyg,
					],
				},
				{
					label: "CRAs",
					name: "cras",
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
