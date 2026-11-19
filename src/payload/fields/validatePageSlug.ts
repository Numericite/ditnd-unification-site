import type { PayloadRequest, TextFieldSingleValidation } from "payload";
import { slugify } from "~/utils/tools";
import { SECTION_FALLBACKS } from "~/utils/redirects";
import {
	SECTION_CODED_PAGES,
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
	"a-propos",
	"accessibilite",
	"contact-particuliers",
	"contact-pros-cra",
	"donnees-personnelles",
	"draft",
	"fiches-pratiques",
	"formations",
	"index",
	"mentions-legales",
	"newsletter-confirmee",
	"parcours",
	"plan-du-site",
	"recherche",
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
 * Une page ou une rubrique est servie avant les redirections : sur un chemin
 * déjà redirigé, elle masquerait la redirection.
 */
export const redirectConflict = async (
	req: PayloadRequest,
	path: string,
): Promise<string | null> => {
	const fallback = SECTION_FALLBACKS.find(([prefix]) => prefix === path);
	if (fallback) return `Adresse redirigée vers ${fallback[1]}`;

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
	const section = sectionOf(populated);
	if (section) {
		const coded = SECTION_CODED_PAGES[section.slug] ?? [];
		if (coded.some((page) => page.slug === slug)) {
			return "Adresse déjà utilisée par le site";
		}
	} else {
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
