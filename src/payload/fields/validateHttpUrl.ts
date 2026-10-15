import type { TextFieldSingleValidation } from "payload";

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
