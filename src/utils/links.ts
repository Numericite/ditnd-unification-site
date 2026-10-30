// URL publique d'un document référencé par une relation polymorphe (cibles de
// redirection, liens du menu principal). Seules les collections dont l'URL se
// déduit du slug sont prises en charge.

// Seule liste des collections pointables : le menu et les redirections la
// réutilisent. Ajouter une collection ici avec son chemin public suffit.
const REFERENCE_BASE_PATHS = {
	pages: "",
	"practical-guides": "/fiches-pratiques",
	courses: "/formations",
} as const;

export type ReferenceCollection = keyof typeof REFERENCE_BASE_PATHS;

export const REFERENCE_COLLECTIONS = Object.keys(
	REFERENCE_BASE_PATHS,
) as ReferenceCollection[];

export type DocumentReference = {
	relationTo: ReferenceCollection;
	value:
		| { slug?: string | null; _status?: string | null }
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
	const basePath = REFERENCE_BASE_PATHS[reference.relationTo];
	return basePath !== undefined && value.slug
		? `${basePath}/${value.slug}`
		: null;
};

/** Normalise une URL source : path seul, sans domaine, slash final ni query. */
export const normalizeFromPath = (raw: string): string => {
	let from = raw.trim();
	from = from.replace(/^https?:\/\/[^/]+/i, "");
	from = from.split(/[?#]/)[0] ?? "";
	if (!from.startsWith("/")) from = `/${from}`;
	if (from.length > 1) from = from.replace(/\/+$/, "");
	return from.toLowerCase();
};
