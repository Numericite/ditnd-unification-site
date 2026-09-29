import type { Field, GlobalConfig } from "payload";
import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from "@payloadcms/plugin-seo/fields";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";
import { standardFields } from "~/payload/fields/standards";

const imageBannerField = {
	name: "imageBanner",
	type: "upload",
	relationTo: "medias",
	required: false,
	label: { fr: "Image de la bannière" },
} as const;

const seoGroupField = (tabName: string): Field => {
	const titlePath = `${tabName}.meta.title`;
	const descriptionPath = `${tabName}.meta.description`;
	const imagePath = `${tabName}.meta.image`;

	return {
		name: "meta",
		type: "group",
		label: "SEO",
		fields: [
			OverviewField({ titlePath, descriptionPath, imagePath }),
			MetaTitleField({ hasGenerateFn: false }),
			MetaDescriptionField({ hasGenerateFn: false }),
			MetaImageField({ hasGenerateFn: false, relationTo: "medias" }),
			PreviewField({ hasGenerateFn: false, titlePath, descriptionPath }),
		],
	};
};

export const CMSAbout: GlobalConfig = {
	slug: "about",
	label: "À propos",
	admin: {
		group: { fr: "Pages" },
		hidden: hideForNonAdmin,
	},
	access: {
		read: isAdmin,
		update: isAdmin,
	},
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
						seoGroupField("maisonDeLAutisme"),
					],
				},
				{
					label: "GNCRA",
					name: "gncra",
					fields: [
						standardFields.title,
						imageBannerField,
						standardFields.wysiwyg,
						seoGroupField("gncra"),
					],
				},
				{
					label: "CRA",
					name: "cras",
					fields: [
						standardFields.title,
						imageBannerField,
						standardFields.wysiwyg,
						seoGroupField("cras"),
					],
				},
			],
		},
	],
};
