import type { TextFieldSingleValidation } from "payload";
import { slugify } from "~/utils/tools";
import { SECTION_CODED_PAGES, sectionPath } from "~/utils/pages";
import { RESERVED_SLUGS, redirectConflict } from "./validatePageSlug";

// Une rubrique est servie sur `/{slug}`, comme une page à la racine : les deux
// ne doivent pas se marcher dessus.
export const validateSectionSlug: TextFieldSingleValidation = async (
	value,
	{ req, id },
) => {
	const slug = typeof value === "string" ? slugify(value) : "";
	if (!slug) return true;

	// Les pages codées (ex. /a-propos/glossaire) ont une URL fixe : renommer
	// leur rubrique les en détacherait. Validé après le hook du slug, ce
	// contrôle couvre aussi un slug qui suivrait un changement de libellé.
	if (id !== undefined) {
		const current = await req.payload
			.findByID({ collection: "page-sections", id, depth: 0, req })
			.catch(() => null);
		if (
			current &&
			current.slug !== slug &&
			current.slug in SECTION_CODED_PAGES
		) {
			return `Identifiant non modifiable : des pages du site sont servies sous /${current.slug}`;
		}
	}

	if (RESERVED_SLUGS.has(slug) && !(slug in SECTION_CODED_PAGES)) {
		return "Adresse déjà utilisée par le site";
	}

	const { totalDocs } = await req.payload.count({
		collection: "pages",
		where: { slug: { equals: slug }, section: { exists: false } },
		overrideAccess: true,
		req,
	});
	if (totalDocs > 0) return "Adresse déjà utilisée par une page";

	return (await redirectConflict(req, sectionPath(slug))) ?? true;
};
