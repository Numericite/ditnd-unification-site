import type { GlobalConfig } from "payload";
import { standardFields } from "~/payload/fields/standards";

export const CMSHome: GlobalConfig = {
	slug: "home",
	label: "CMS - Accueil",
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "En-tête",
					name: "header",
					fields: [standardFields.title, standardFields.description],
				},

				{
					label: "Persona",
					name: "tiles",
					fields: [standardFields.description],
				},
				{
					label: "Fiches pratiques les plus lues",
					name: "mostViewedGuides",
					fields: [standardFields.title, standardFields.description],
				},
			],
		},
	],
};
