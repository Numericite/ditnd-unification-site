import type { GroupField } from "payload";
import {
	validateInternalPath,
	validateRequiredHttpUrl,
} from "./validateHttpUrl";

export const MENU_LINK_COLLECTIONS = [
	"pages",
	"practical-guides",
	"courses",
] as const;

// Cible d'un lien du menu principal. Un lien externe s'ouvre toujours dans un
// nouvel onglet : ce n'est pas un choix laissé à l'éditeur.
export const menuLinkField: GroupField = {
	name: "link",
	type: "group",
	label: { fr: "Cible" },
	fields: [
		{
			name: "type",
			type: "radio",
			required: true,
			defaultValue: "reference",
			label: { fr: "Type de lien" },
			options: [
				{ label: "Page, fiche ou formation", value: "reference" },
				{ label: "Lien interne", value: "internal" },
				{ label: "Lien externe", value: "external" },
			],
			admin: { layout: "horizontal" },
		},
		{
			name: "reference",
			type: "relationship",
			relationTo: [...MENU_LINK_COLLECTIONS],
			required: true,
			label: { fr: "Contenu" },
			filterOptions: { _status: { equals: "published" } },
			admin: {
				condition: (_, siblingData) => siblingData?.type === "reference",
			},
		},
		{
			name: "internalUrl",
			type: "text",
			required: true,
			label: { fr: "Chemin" },
			validate: validateInternalPath,
			admin: {
				description: "Chemin d'une page du site, par exemple /a-propos/cra.",
				condition: (_, siblingData) => siblingData?.type === "internal",
			},
		},
		{
			name: "externalUrl",
			type: "text",
			required: true,
			label: { fr: "URL" },
			validate: validateRequiredHttpUrl,
			admin: {
				description:
					"Adresse complète, par exemple https://exemple.fr. S'ouvre dans un nouvel onglet.",
				condition: (_, siblingData) => siblingData?.type === "external",
			},
		},
	],
};
