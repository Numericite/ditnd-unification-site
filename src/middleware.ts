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
	// L'optimiseur de next/image relit les médias par une requête interne sans
	// en-têtes : l'exiger casserait toutes les images (/_next/image reste protégé).
	if (request.nextUrl.pathname.startsWith("/api/medias/file/")) return false;

	if (
		BASIC_AUTH_DISABLED ||
		process.env.NODE_ENV === "development" ||
		isAuthorized(request.headers.get("authorization"))
	)
		return false;

	return true;
};

export function middleware(request: NextRequest) {
	if (requiresBasicAuth(request)) {
		return new Response(null, {
			status: 401,
			headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
		});
	}

	// Médias hérités : réécrits vers S3 (next.config.js). Le navigateur renvoie
	// l'en-tête Authorization de la basic auth sur chaque requête ; transmis
	// à S3, il est interprété comme une signature AWS invalide → AccessDenied.
	if (request.nextUrl.pathname.startsWith("/app/uploads/")) {
		const headers = new Headers(request.headers);
		headers.delete("authorization");
		return NextResponse.next({ request: { headers } });
	}

	return NextResponse.next();
}
