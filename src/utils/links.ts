// URL publique d'un document référencé par une relation polymorphe (cibles de
// redirection, liens du menu principal). Seules les collections dont l'URL se
// déduit du slug sont prises en charge.

export type DocumentReference = {
	relationTo: string;
	value:
		| { slug?: string | null; _status?: string | null }
		| number
		| string
		| null;
};

const REFERENCE_BASE_PATHS: Record<string, string> = {
	"practical-guides": "/fiches-pratiques",
	courses: "/formations",
	pages: "",
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
