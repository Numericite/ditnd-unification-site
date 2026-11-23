import { glossaryTermHref } from "./glossary";
import { type SectionRef, documentPath } from "./pages";

type LinkedDoc = {
	slug?: string | null;
	_status?: string | null;
	url?: string | null;
	name?: string | null;
	section?: SectionRef;
	doc?: { relationTo?: string; value?: unknown } | null;
};

/**
 * URL publique d'un document ciblé par un lien interne lexical. Le document
 * doit être peuplé ; sinon (dépublié, profondeur dépassée), pas d'URL.
 */
export const internalDocToHref = (doc: {
	relationTo: string;
	value: unknown;
}): string | undefined => {
	const value = doc.value;
	if (!value || typeof value !== "object") return undefined;
	const linked = value as LinkedDoc;
	if (linked._status && linked._status !== "published") return undefined;

	switch (doc.relationTo) {
		case "medias":
			return linked.url ?? undefined;
		case "glossary":
			return glossaryTermHref(linked.name);
		case "search-results": {
			// Entrée de l'index de recherche : pointe vers le document indexé.
			const target = linked.doc?.relationTo;
			if (!target || target === "pages") return undefined;
			return documentPath(target, linked) ?? undefined;
		}
		case "pages":
			// Rubrique non peuplée : l'URL serait celle d'une page à la racine.
			if (linked.section != null && typeof linked.section !== "object") {
				return undefined;
			}
			return documentPath("pages", linked) ?? undefined;
		default:
			return documentPath(doc.relationTo, linked) ?? undefined;
	}
};
