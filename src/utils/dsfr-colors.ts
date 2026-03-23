/**
 * Liste exhaustive des couleurs d'accentuation du DSFR.
 * @see https://www.systeme-de-design.gouv.fr/fondamentaux/couleurs-palette
 *
 * Réutilisable dans les blocs Payload (CallOut, Citation, etc.)
 * sous forme d'options de select.
 */

export const dsfrAccentColors = [
	{ label: "Vert - Tilleul verveine", value: "green-tilleul-verveine" },
	{ label: "Vert - Bourgeon", value: "green-bourgeon" },
	{ label: "Vert - Émeraude", value: "green-emeraude" },
	{ label: "Vert - Menthe", value: "green-menthe" },
	{ label: "Vert - Archipel", value: "green-archipel" },
	{ label: "Bleu - Écume", value: "blue-ecume" },
	{ label: "Bleu - Cumulus", value: "blue-cumulus" },
	{ label: "Violet - Glycine", value: "purple-glycine" },
	{ label: "Rose - Macaron", value: "pink-macaron" },
	{ label: "Rose - Tuile", value: "pink-tuile" },
	{ label: "Jaune - Tournesol", value: "yellow-tournesol" },
	{ label: "Jaune - Moutarde", value: "yellow-moutarde" },
	{ label: "Orange - Terre battue", value: "orange-terre-battue" },
	{ label: "Marron - Café crème", value: "brown-cafe-creme" },
	{ label: "Marron - Caramel", value: "brown-caramel" },
	{ label: "Marron - Opéra", value: "brown-opera" },
	{ label: "Beige - Gris galet", value: "beige-gris-galet" },
] as const;

export type DsfrAccentColor = (typeof dsfrAccentColors)[number]["value"];
