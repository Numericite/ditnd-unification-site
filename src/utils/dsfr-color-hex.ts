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

export const readableTextOn = (hex: string): string => {
	const h = hex.replace("#", "");
	const r = Number.parseInt(h.slice(0, 2), 16);
	const g = Number.parseInt(h.slice(2, 4), 16);
	const b = Number.parseInt(h.slice(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.6 ? "#161616" : "#ffffff";
};
