import type { GroupField, RelationshipFieldSingleValidation } from "payload";
import { relationship } from "payload/shared";
import { REFERENCE_COLLECTIONS } from "~/utils/links";
import {
	validateInternalPath,
	validateRequiredHttpUrl,
} from "./validateHttpUrl";

// Un contenu dépublié ou supprimé disparaît du menu sur le site. Le validateur
// de Payload bloque déjà l'enregistrement (filterOptions, required), mais avec
// des messages génériques : on dit à l'éditeur pourquoi et quoi faire.
const validateReference: RelationshipFieldSingleValidation = async (
	value,
	options,
) => {
	const result = await relationship(value, options);
	if (result === true) return true;
	if (!value) {
		return "Choisissez un contenu. Si un contenu était choisi, il a été supprimé : le lien est masqué sur le site.";
	}
	if (
		typeof result === "string" &&
		result.startsWith(options.req.t("validation:invalidSelections"))
	) {
		return "Ce contenu n'est plus publié ou a été supprimé : le lien est masqué sur le site. Republiez-le ou choisissez-en un autre.";
	}
	return result;
};

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
			relationTo: REFERENCE_COLLECTIONS,
			required: true,
			label: { fr: "Contenu" },
			filterOptions: { _status: { equals: "published" } },
			validate: validateReference,
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
