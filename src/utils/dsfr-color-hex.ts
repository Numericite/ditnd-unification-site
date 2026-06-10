import type { DsfrAccentColor } from "./dsfr-colors";

const DSFR_ACCENT_HEX: Record<DsfrAccentColor, string> = {
	"green-tilleul-verveine": "#b7a73f",
	"green-bourgeon": "#68a532",
	"green-emeraude": "#00a95c",
	"green-menthe": "#009081",
	"green-archipel": "#009099",
	"blue-ecume": "#465f9d",
	"blue-cumulus": "#417dc4",
	"purple-glycine": "#a558a0",
	"pink-macaron": "#e18b76",
	"pink-tuile": "#ce614a",
	"yellow-tournesol": "#c8aa39",
	"yellow-moutarde": "#c3992a",
	"orange-terre-battue": "#e4794a",
	"brown-cafe-creme": "#d1b781",
	"brown-caramel": "#c08c65",
	"brown-opera": "#bd987a",
	"beige-gris-galet": "#aea397",
};

const DSFR_PRIMARY = "#000091";

export const dsfrAccentHex = (variant?: string | null): string => {
	if (!variant) return DSFR_PRIMARY;
	return DSFR_ACCENT_HEX[variant as DsfrAccentColor] ?? DSFR_PRIMARY;
};
