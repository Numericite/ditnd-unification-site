// Regroupement alphabétique du glossaire, partagé par la page /glossaire et
// les liens internes vers un terme (filtre ?lettre=).

export const OTHER_LETTER = "#";

export function normalizeGlossaryText(text: string): string {
	return text
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();
}

export function glossaryInitial(name: string): string {
	const letter = normalizeGlossaryText(name).charAt(0).toUpperCase();
	return /[A-Z]/.test(letter) ? letter : OTHER_LETTER;
}

/** Page du glossaire filtrée sur la lettre du terme. */
export const glossaryTermHref = (name: string | null | undefined): string =>
	name?.trim()
		? `/glossaire?lettre=${encodeURIComponent(glossaryInitial(name).toLowerCase())}`
		: "/glossaire";
