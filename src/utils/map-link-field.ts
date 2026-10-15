/**
 * Valeur stockée dans `metadata[key]` d'un marqueur pour un champ
 * personnalisé de type "link".
 */
export type MapLinkValue = {
	label?: string | null;
	url: string;
};

export const isValidHttpUrl = (value: string): boolean => {
	try {
		const url = new URL(value);
		return url.protocol === "https:" || url.protocol === "http:";
	} catch {
		return false;
	}
};

/**
 * Normalise une valeur brute de métadonnée en lien affichable.
 * Retourne null si aucune URL http(s) valide n'est présente.
 */
export const toMapLinkValue = (raw: unknown): MapLinkValue | null => {
	if (typeof raw === "string") {
		return parseMapLinkCell(raw);
	}
	if (raw && typeof raw === "object" && !Array.isArray(raw)) {
		const { label, url } = raw as { label?: unknown; url?: unknown };
		if (typeof url !== "string" || !isValidHttpUrl(url.trim())) return null;
		return {
			url: url.trim(),
			label: typeof label === "string" && label.trim() ? label.trim() : null,
		};
	}
	return null;
};

/**
 * Parse une cellule d'import Excel : "https://…" ou "Libellé | https://…".
 */
export const parseMapLinkCell = (raw: string): MapLinkValue | null => {
	const value = raw.trim();
	if (!value) return null;
	// Une URL seule peut contenir des "|" : on ne cherche un libellé que si la
	// cellule ne commence pas déjà par l'URL.
	const sep = /^https?:\/\//i.test(value) ? -1 : value.indexOf("|");
	const label = sep >= 0 ? value.slice(0, sep).trim() : "";
	const url = (sep >= 0 ? value.slice(sep + 1) : value).trim();
	if (!isValidHttpUrl(url)) return null;
	return { url, label: label || null };
};
