import type { GlobalConfig } from "payload";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";
import { standardFields } from "~/payload/fields/standards";

const imageBannerField = {
	name: "imageBanner",
	type: "upload",
	relationTo: "medias",
	required: false,
	label: { fr: "Image de la bannière" },
} as const;

export const CMSCartographie: GlobalConfig = {
	slug: "cartographie",
	label: "Cartographie",
	admin: {
		group: { fr: "Pages" },
		hidden: hideForNonAdmin,
	},
	access: {
		read: isAdmin,
		update: isAdmin,
	},
	fields: [standardFields.title, imageBannerField, standardFields.wysiwyg],
};
