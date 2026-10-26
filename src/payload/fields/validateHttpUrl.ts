import type { TextFieldSingleValidation } from "payload";
import { text } from "payload/shared";

/**
 * Le champ est rendu tel quel dans un `href` côté public : on n'accepte que des
 * URL absolues en http(s) pour éviter les liens cassés et les `javascript:`.
 */
export const validateHttpUrl: TextFieldSingleValidation = (value) => {
	if (!value) return true;
	try {
		const url = new URL(value);
		if (url.protocol !== "https:" && url.protocol !== "http:") {
			return "L'URL doit commencer par http:// ou https://";
		}
	} catch {
		return "L'URL n'est pas valide.";
	}
	return true;
};

// Chemin interne : commence par un seul « / ». Les navigateurs traitent « \ »
// comme « / » et ignorent tabulations et retours à la ligne : « /\exemple.fr »
// ou « /<tab>/exemple.fr » deviendraient des liens vers un autre site.
const INTERNAL_PATH = /^\/(?![/\\])[^\s\\]*$/;

/** Chemin interne au site (`/formations`), obligatoire si `required`. */
export const validateInternalPath: TextFieldSingleValidation = (
	value,
	options,
) => {
	const textResult = text(value, options);
	if (textResult !== true) return textResult;
	if (!value) return true;
	return (
		INTERNAL_PATH.test(value) ||
		"Le lien interne doit commencer par « / » (ex : /formations)."
	);
};

/** URL externe en http(s), obligatoire si `required`. */
export const validateRequiredHttpUrl: TextFieldSingleValidation = (
	value,
	options,
) => {
	const textResult = text(value, options);
	if (textResult !== true) return textResult;
	return validateHttpUrl(value, options);
};

/**
 * Variante qui accepte aussi les liens internes au site (`/formations`).
 */
export const validateHttpOrInternalUrl: TextFieldSingleValidation = (
	value,
	options,
) => {
	// Un `validate` personnalisé remplace celui de Payload : on rappelle `text`
	// pour conserver la vérification de `required`.
	const textResult = text(value, options);
	if (textResult !== true) return textResult;
	if (!value) return true;

	if (value.startsWith("/")) {
		return (
			INTERNAL_PATH.test(value) ||
			"Le lien interne n'est pas valide (ex : /formations)."
		);
	}

	return validateHttpUrl(value, options);
};
