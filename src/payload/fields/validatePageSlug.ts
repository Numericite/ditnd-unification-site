import type { PayloadRequest, TextFieldSingleValidation } from "payload";
import { slugify } from "~/utils/tools";
import { SECTION_FALLBACKS } from "~/utils/redirects";
import { PAGE_REDIRECTS } from "~/utils/page-redirects";
import {
	type SectionRef,
	pagePath,
	sectionOf,
	withPopulatedSection,
} from "~/utils/pages";

/**
 * Premiers segments d'URL déjà servis par le site. Les pages CMS étant servies
 * sur `/{slug}`, Next donne la priorité à ces routes : une page qui reprendrait
 * l'un de ces slugs serait inaccessible.
 * À tenir à jour en cas d'ajout d'une route dans src/pages ou src/app.
 */
export const RESERVED_SLUGS = new Set([
	// src/pages
	"accessibilite",
	"donnees-personnelles",
	"draft",
	"fiches-pratiques",
	"formations",
	"glossaire",
	"index",
	"mentions-legales",
	"newsletter-confirmee",
	"parcours",
	"plan-du-site",
	"recherche",
	"se-former",
	// Pages d'erreur Next
	"404",
	"500",
	// src/app (Payload) et réécritures de next.config.js
	"admin",
	"api",
	"app",
]);

type RedirectTarget = {
	type?: "reference" | "custom" | null;
	url?: string | null;
	reference?: unknown;
};

const hasTarget = (to: RedirectTarget | null | undefined): boolean => {
	if (!to) return false;
	if (to.type === "custom") return Boolean(to.url?.trim());
	return Boolean(to.reference);
};

/**
 * Sur un chemin déjà redirigé, une page ou une rubrique serait inaccessible
 * (next.config.js redirige avant tout routage) ou masquerait la redirection
 * (les autres ne sont résolues qu'en cas de 404).
 */
export const redirectConflict = async (
	req: PayloadRequest,
	path: string,
): Promise<string | null> => {
	const fallback = SECTION_FALLBACKS.find(([prefix]) => prefix === path);
	if (fallback) return `Adresse redirigée vers ${fallback[1]}`;

	const moved = PAGE_REDIRECTS.find(({ source }) => source === path);
	if (moved) return `Adresse redirigée vers ${moved.destination}`;

	const { docs } = await req.payload.find({
		collection: "redirects",
		where: { from: { equals: path } },
		depth: 0,
		limit: 1,
		overrideAccess: true,
		req,
	});
	const redirect = docs[0] as { to?: RedirectTarget } | undefined;
	if (redirect && hasTarget(redirect.to)) {
		return "Une redirection existe pour cette adresse";
	}

	return null;
};

export const validatePageSlug: TextFieldSingleValidation = async (
	value,
	{ req, siblingData },
) => {
	const slug = typeof value === "string" ? slugify(value) : "";
	if (!slug) return true;

	const { section: populated } = await withPopulatedSection(req, {
		section: (siblingData as { section?: SectionRef })?.section,
	});
	if (!sectionOf(populated)) {
		if (RESERVED_SLUGS.has(slug)) return "Adresse déjà utilisée par le site";
		const { totalDocs } = await req.payload.count({
			collection: "page-sections",
			where: { slug: { equals: slug } },
			overrideAccess: true,
			req,
		});
		if (totalDocs > 0) return "Adresse déjà utilisée par une rubrique";
	}

	return (
		(await redirectConflict(req, pagePath({ slug, section: populated }))) ??
		true
	);
};
