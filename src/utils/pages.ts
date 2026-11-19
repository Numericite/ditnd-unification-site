import type { PayloadRequest } from "payload";

/**
 * Pages codées servies sous une rubrique : leur identifiant y est réservé et
 * elles sont listées sur la page de la rubrique, après les pages CMS.
 */
export const SECTION_CODED_PAGES: Record<
	string,
	{ slug: string; title: string }[]
> = {
	"a-propos": [{ slug: "glossaire", title: "Glossaire" }],
};

/** Rubrique d'une page : peuplée, simple id, ou absente. */
export type SectionRef =
	| number
	| { slug?: string | null; title?: string | null }
	| null
	| undefined;

export const sectionOf = (section: SectionRef) =>
	typeof section === "object" && section?.slug
		? { slug: section.slug, title: section.title ?? section.slug }
		: null;

export const sectionPath = (slug: string) => `/${slug}`;

/** La rubrique doit être peuplée : un simple id donnerait l'URL racine. */
export const pagePath = ({
	slug,
	section,
}: {
	slug?: string | null;
	section?: SectionRef;
}) => {
	const sectionSlug = sectionOf(section)?.slug;
	return sectionSlug ? `/${sectionSlug}/${slug}` : `/${slug}`;
};

/**
 * Peuple la rubrique d'une page quand elle n'est qu'un id (données d'un
 * formulaire admin, document à depth 0).
 */
export const withPopulatedSection = async <T extends { section?: SectionRef }>(
	req: PayloadRequest,
	doc: T,
): Promise<T> => {
	if (typeof doc.section !== "number") return doc;
	const section = await req.payload
		.findByID({
			collection: "page-sections",
			id: doc.section,
			depth: 0,
			req,
		})
		.catch(() => null);
	return { ...doc, section };
};

const COLLECTION_PATHS: Record<string, string> = {
	"practical-guides": "/fiches-pratiques",
	courses: "/formations",
};

export const documentPath = (
	collection: string | undefined,
	doc: { slug?: string | null; section?: SectionRef },
) => {
	if (!doc.slug) return null;
	if (collection === "pages") return pagePath(doc);
	const basePath = collection ? COLLECTION_PATHS[collection] : undefined;
	return basePath ? `${basePath}/${doc.slug}` : null;
};
