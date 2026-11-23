import type { GlobalConfig } from "payload";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";
import { standardFields } from "~/payload/fields/standards";
import { homeSectionsField } from "./homeSections";

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
					fields: [
						{
							...standardFields.title,
							type: "textarea",
							admin: {
								description: "Les retours à la ligne sont conservés.",
							},
						},
						{
							name: "description",
							label: "Description",
							type: "textarea",
						},
					],
				},
				{
					label: "Sections",
					fields: [homeSectionsField],
				},
			],
		},
	],
};
