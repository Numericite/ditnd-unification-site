import type { TextFieldSingleValidation } from "payload";
import { slugify } from "~/utils/tools";
import { sectionPath } from "~/utils/pages";
import { RESERVED_SLUGS, redirectConflict } from "./validatePageSlug";

// Une rubrique est servie sur `/{slug}`, comme une page à la racine : les deux
// ne doivent pas se marcher dessus.
export const validateSectionSlug: TextFieldSingleValidation = async (
	value,
	{ req },
) => {
	const slug = typeof value === "string" ? slugify(value) : "";
	if (!slug) return true;

	if (RESERVED_SLUGS.has(slug)) return "Adresse déjà utilisée par le site";

	const { totalDocs } = await req.payload.count({
		collection: "pages",
		where: { slug: { equals: slug }, section: { exists: false } },
		overrideAccess: true,
		req,
	});
	if (totalDocs > 0) return "Adresse déjà utilisée par une page";

	return (await redirectConflict(req, sectionPath(slug))) ?? true;
};
