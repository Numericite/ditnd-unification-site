import { documentPath } from "./pages";

// URL publique d'un document référencé par une relation polymorphe (cibles de
// redirection, liens du menu principal).

// Seule liste des collections pointables : le menu et les redirections la
// réutilisent. Une collection ajoutée ici doit avoir son chemin dans
// `documentPath`.
const COLLECTIONS = ["pages", "practical-guides", "courses"] as const;

export type ReferenceCollection = (typeof COLLECTIONS)[number];

export const REFERENCE_COLLECTIONS: ReferenceCollection[] = [...COLLECTIONS];

export type DocumentReference = {
	relationTo: ReferenceCollection;
	value:
		| {
				slug?: string | null;
				section?: string | null;
				_status?: string | null;
		  }
		| number
		| string
		| null;
};

/**
 * Retourne null si le document n'est pas peuplé, n'a pas de slug ou n'est pas
 * publié : un lien vers une page dépubliée mènerait à une 404.
 */
export const referenceHref = (
	reference: DocumentReference | null | undefined,
): string | null => {
	const value = reference?.value;
	if (!reference || !value || typeof value !== "object") return null;
	if (value._status && value._status !== "published") return null;
	return documentPath(reference.relationTo, value);
};

/**
 * Normalise une URL pour la comparer : path seul en minuscules, sans domaine,
 * slash final ni query.
 */
export const normalizePath = (raw: string): string => {
	let path = raw.trim();
	path = path.replace(/^https?:\/\/[^/]+/i, "");
	path = path.split(/[?#]/)[0] ?? "";
	if (!path.startsWith("/")) path = `/${path}`;
	if (path.length > 1) path = path.replace(/\/+$/, "");
	return path.toLowerCase();
};
