import { NextResponse, type NextRequest } from "next/server";

// Temporary HTTP Basic Authentication in preprod environment.
const BASIC_USER = process.env.BASIC_USER ?? "";
const BASIC_PASSWORD = process.env.BASIC_PASSWORD ?? "";
const BASIC_AUTH_DISABLED = process.env.BASIC_AUTH_DISABLED === "true";

if (!BASIC_AUTH_DISABLED && (!BASIC_USER || !BASIC_PASSWORD)) {
	throw new Error("Missing env.BASIC_USER or env.BASIC_PASSWORD");
}

export const isAuthorized = (authHeader: string | null): boolean => {
	if (!authHeader || !authHeader?.startsWith("Basic ")) {
		return false;
	}
	const decoded = Buffer.from(authHeader.slice(6).trim(), "base64").toString(
		"utf8",
	);
	const [user, pass] = decoded.split(":");
	return user === BASIC_USER && pass === BASIC_PASSWORD;
};

const requiresBasicAuth = (request: NextRequest): boolean => {
	const { pathname } = request.nextUrl;
	const isFromAdmin = request.headers.get("referer")?.includes("/admin");

	if (
		pathname.startsWith("/admin") ||
		(isFromAdmin && pathname.startsWith("/api"))
	)
		return false;

	if (
		BASIC_AUTH_DISABLED ||
		process.env.NODE_ENV === "development" ||
		isAuthorized(request.headers.get("authorization"))
	)
		return false;

	return true;
};

/**
 * Redirections 301 des URLs de l'ancien site WordPress.
 * Voir docs/plan-redirections-seo.md.
 *
 * Trois niveaux :
 *  1. correspondance exacte dans la collection Payload "redirects"
 *     (carte servie par /api/redirects-map, cachée ici en mémoire) ;
 *  2. fallbacks de section pour les anciennes URLs sans équivalent ;
 *  3. sinon, laisser passer (la 404 enrichie prend le relais).
 *
 * La query string est transférée vers la cible. Le slash final est déjà
 * retiré par Next (308 natif) avant que le middleware ne voie la requête.
 */

const MAP_TTL_MS = 60_000;
const MAP_FETCH_TIMEOUT_MS = 3_000;

// Anciennes sections sans page équivalente : redirigées vers la section la
// plus proche du nouveau site. Pas de fallback pour
// /evenements-maison-de-l-autisme (section actus abandonnée) → 404 enrichie.
const SECTION_FALLBACKS: Array<[prefix: string, target: string]> = [
	["/fiches-pratiques-autisme", "/fiches-pratiques"],
	["/accueil-se-former-tnd", "/formations"],
	["/accueil", "/a-propos"],
];

let cachedMap: Record<string, string> = {};
let mapExpiresAt = 0;
let mapLoadedOnce = false;

const getRedirectMap = async (
	origin: string,
): Promise<Record<string, string>> => {
	const now = Date.now();
	if (mapLoadedOnce && mapExpiresAt > now) return cachedMap;
	try {
		const res = await fetch(`${origin}/api/redirects-map`, {
			signal: AbortSignal.timeout(MAP_FETCH_TIMEOUT_MS),
		});
		if (res.ok) {
			cachedMap = (await res.json()) as Record<string, string>;
			mapLoadedOnce = true;
		}
	} catch {
		// API indisponible : on garde la carte précédente (éventuellement vide) —
		// les fallbacks de section restent appliqués quoi qu'il arrive.
	}
	mapExpiresAt = now + MAP_TTL_MS;
	return cachedMap;
};

const buildRedirect = (request: NextRequest, target: string) => {
	const url = target.startsWith("http")
		? new URL(target)
		: new URL(target, request.nextUrl.origin);
	request.nextUrl.searchParams.forEach((value, key) => {
		if (!url.searchParams.has(key)) url.searchParams.append(key, value);
	});
	return NextResponse.redirect(url, 301);
};

// Tout sauf les assets, l'admin, les APIs et les fichiers (les anciennes
// URLs de pages WordPress ne contiennent jamais de point).
const REDIRECTS_MATCHER = /^\/(?!api|_next|admin|draft|app\/uploads|.*\.).*$/;

export async function middleware(request: NextRequest) {
	if (requiresBasicAuth(request)) {
		return new Response("Auth Required", {
			status: 401,
			headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
		});
	}

	if (!REDIRECTS_MATCHER.test(request.nextUrl.pathname)) {
		return NextResponse.next();
	}

	const pathname = request.nextUrl.pathname.toLowerCase();

	const map = await getRedirectMap(request.nextUrl.origin);
	const exact = map[pathname];
	if (exact) return buildRedirect(request, exact);

	for (const [prefix, target] of SECTION_FALLBACKS) {
		if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
			return buildRedirect(request, target);
		}
	}

	return NextResponse.next();
}

export const config = {
	// Périmètre de la basic auth ; les redirections sont restreintes plus
	// finement par REDIRECTS_MATCHER.
	matcher:
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|placeholder.16x9.png).*)",
};
