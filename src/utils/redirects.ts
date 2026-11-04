// Legacy sections with no equivalent page: redirected to the closest section
// of the new site. No fallback for /evenements-maison-de-l-autisme (dropped
// news section) → enriched 404.
// Shared by src/server/redirects.ts and the page slug validation.
export const SECTION_FALLBACKS: Array<[prefix: string, target: string]> = [
	["/fiches-pratiques-autisme", "/fiches-pratiques"],
	["/accueil-se-former-tnd", "/formations"],
	["/accueil", "/a-propos"],
];
