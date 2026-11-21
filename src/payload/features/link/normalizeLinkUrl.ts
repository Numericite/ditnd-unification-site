/**
 * Normalise l'URL d'un lien lexical avant enregistrement.
 *
 * Remplace le hook beforeChange de @payloadcms/richtext-lexical (3.90), qui
 * applique encodeURIComponent à toute URL refusée par son validateUrl : un
 * chemin relatif contenant une espace ou un `%` (`/api/medias/file/a%20b.pdf`)
 * est refusé, encodé en `%2Fapi%2F…`, toujours refusé, donc ré-encodé à chaque
 * enregistrement et autosave (`%25252525…`). Le lien devient inutilisable.
 *
 * Ici, on n'encode jamais l'URL entière :
 *  - une URL déjà abîmée par ce bug (commence par `%2F` ou `https%3A`, avec ou
 *    sans `%25` emboîtés) est décodée jusqu'à retrouver sa forme d'origine ;
 *  - les erreurs de saisie courantes sont corrigées : protocole doublé
 *    (`https://https//…`) et protocole devant un chemin (`https:///api/…`) ;
 *  - les espaces sont encodées en `%20`.
 */

// URL entièrement encodée par encodeURIComponent, une ou plusieurs fois.
const FULLY_ENCODED = /^(?:https?)?%(?:25)*(?:2F|3A)/i;
const MAX_DECODE_PASSES = 1000;

const decodeFullyEncoded = (url: string): string => {
	let current = url;
	for (let i = 0; i < MAX_DECODE_PASSES && FULLY_ENCODED.test(current); i++) {
		try {
			const decoded = decodeURIComponent(current);
			if (decoded === current) break;
			current = decoded;
		} catch {
			break;
		}
	}
	return current;
};

export const normalizeLinkUrl = (value: unknown): unknown => {
	if (typeof value !== "string") return value;

	let url = decodeFullyEncoded(value.trim());

	// `https://https//site.fr`, `https://https://site.fr` → `https://site.fr`
	url = url.replace(/^https?:\/\/(?=https?:?\/\/)/i, "");
	url = url.replace(/^(https?):?\/\/(?!\/)/i, "$1://");
	// `https:///api/…` (protocole saisi devant un chemin) → `/api/…`
	url = url.replace(/^https?:\/\/\/+/i, "/");

	return url.replace(/\s/g, "%20");
};
