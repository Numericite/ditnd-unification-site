// Temporary middleware for HTTP Basic Authentication in preprod environment.
import { type NextRequest, NextResponse } from "next/server";

const BASIC_USER = process.env.BASIC_USER ?? "";
const BASIC_PASSWORD = process.env.BASIC_PASSWORD ?? "";

if (!BASIC_USER || !BASIC_PASSWORD) {
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

export function proxy(req: NextRequest) {
	const authHeader = req.headers.get("authorization");
	const { pathname } = req.nextUrl;
	const isFromAdmin = req.headers.get("referer")?.includes("/admin");

	if (
		pathname.startsWith("/admin") ||
		(isFromAdmin && pathname.startsWith("/api"))
	)
		return NextResponse.next();

	if (process.env.NODE_ENV === "development" || isAuthorized(authHeader))
		return NextResponse.next();

	return new Response("Auth Required", {
		status: 401,
		headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
	});
}

export const config = {
	matcher:
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|placeholder.16x9.png).*)",
};
