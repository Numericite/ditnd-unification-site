import type { GlobalConfig } from "payload";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";
import { standardFields } from "~/payload/fields/standards";

export const CMSHome: GlobalConfig = {
	slug: "home",
	label: "Accueil",
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
					label: "En-tête",
					name: "header",
					fields: [standardFields.title, standardFields.longDescription],
				},

				{
					label: "Persona",
					name: "tiles",
					fields: [standardFields.longDescription],
				},
				{
					label: "Fiches pratiques les plus lues",
					name: "mostViewedGuides",
					fields: [standardFields.title, standardFields.longDescription],
				},
			],
		},
	],
};
