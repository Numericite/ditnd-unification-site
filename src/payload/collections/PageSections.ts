import type { CollectionBeforeDeleteHook, CollectionConfig } from "payload";
import { APIError } from "payload";
import { slugField } from "../fields/slug";
import { validateSectionSlug } from "../fields/validateSectionSlug";

const beforeDeletePageSection: CollectionBeforeDeleteHook = async ({
	id,
	req,
}) => {
	const { totalDocs } = await req.payload.count({
		collection: "pages",
		where: { section: { equals: id } },
		overrideAccess: true,
		req,
	});
	if (totalDocs > 0) {
		throw new APIError(
			`Impossible de supprimer cette rubrique : ${totalDocs} page(s) y sont rangées. Changez d'abord leur rubrique.`,
			400,
		);
	}
};

export const PageSections: CollectionConfig = {
	slug: "page-sections",
	admin: {
		useAsTitle: "title",
		group: { fr: "Contenus" },
		defaultColumns: ["title", "slug", "updatedAt"],
		description:
			"Regroupent des pages sous une même adresse (/{rubrique}/{page}) et dans le fil d'Ariane. La page /{rubrique} liste automatiquement les pages publiées de la rubrique.",
	},
	labels: {
		singular: "Rubrique",
		plural: "Rubriques",
	},
	hooks: {
		beforeDelete: [beforeDeletePageSection],
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			label: { fr: "Libellé" },
			admin: {
				description:
					"Affiché en titre de la page de la rubrique, dans le fil d'Ariane et dans le plan du site.",
			},
		},
		{
			name: "description",
			type: "textarea",
			required: false,
			label: { fr: "Description" },
			admin: {
				description:
					"Facultative. Utilisée comme description SEO de la page de la rubrique.",
			},
		},
		slugField("page-sections", {
			editable: true,
			validate: validateSectionSlug,
			description:
				"Utilisé dans l'URL de la rubrique et de toutes ses pages. Le modifier change l'URL de chacune de ces pages : pensez à ajouter une redirection pour chacune. Non modifiable pour « À propos », qui contient aussi des pages codées (Glossaire).",
		}),
	],
};
