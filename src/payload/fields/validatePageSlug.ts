import type { TextFieldSingleValidation } from "payload";
import { slugify } from "~/utils/tools";
import { SECTION_FALLBACKS } from "~/utils/redirects";
import {
	PAGE_SECTION_RESERVED_SLUGS,
	pagePath,
	pageSection,
} from "~/utils/pages";

/**
 * Premiers segments d'URL déjà servis par le site. Les pages CMS étant servies
 * sur `/{slug}`, Next donne la priorité à ces routes : une page qui reprendrait
 * l'un de ces slugs serait inaccessible.
 * À tenir à jour en cas d'ajout d'une route dans src/pages ou src/app.
 */
const RESERVED_SLUGS = new Set([
	// src/pages
	"a-propos",
	"accessibilite",
	"contact-particuliers",
	"contact-pros-cra",
	"draft",
	"fiches-pratiques",
	"formations",
	"gestion-des-cookies",
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

export const validatePageSlug: TextFieldSingleValidation = async (
	value,
	{ req, siblingData },
) => {
	const slug = typeof value === "string" ? slugify(value) : "";
	if (!slug) return true;

	const section = pageSection((siblingData as { section?: string })?.section);
	const reserved = section
		? PAGE_SECTION_RESERVED_SLUGS[section.value].includes(slug)
		: RESERVED_SLUGS.has(slug);
	if (reserved) {
		return "Adresse déjà utilisée par le site";
	}

	const path = pagePath({ slug, section: section?.value });
	const fallback = SECTION_FALLBACKS.find(([prefix]) => prefix === path);
	if (fallback) {
		return `Adresse redirigée vers ${fallback[1]}`;
	}

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

	return true;
};
