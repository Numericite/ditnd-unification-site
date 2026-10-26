import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { type DocumentReference, referenceHref } from "~/utils/links";

/**
 * Carte des redirections 301 consommée par le middleware (src/middleware.ts).
 * Retourne un objet plat { "/ancienne-url": "/nouvelle-url" } — les entrées
 * sans cible (seedées mais pas encore complétées) sont ignorées.
 * Voir docs/plan-redirections-seo.md.
 */

const CACHE_TTL_MS = 60_000;

type RedirectTarget = {
	type?: "reference" | "custom" | null;
	url?: string | null;
	reference?: DocumentReference | null;
};

let cache: { map: Record<string, string>; expiresAt: number } | null = null;

const resolveTarget = (
	to: RedirectTarget | null | undefined,
): string | null => {
	if (!to) return null;
	if (to.type === "custom") {
		const url = to.url?.trim();
		return url ? url : null;
	}
	return referenceHref(to.reference);
};

export async function GET() {
	const now = Date.now();
	if (cache && cache.expiresAt > now) {
		return NextResponse.json(cache.map);
	}

	const payload = await getPayload({ config: configPromise });
	const map: Record<string, string> = {};
	let page = 1;
	let hasNextPage = true;

	while (hasNextPage) {
		const result = await payload.find({
			collection: "redirects",
			depth: 1,
			limit: 500,
			page,
			overrideAccess: true,
		});
		for (const doc of result.docs) {
			const from = (doc as { from?: string }).from;
			const target = resolveTarget((doc as { to?: RedirectTarget }).to);
			if (from && target && target !== from) {
				map[from] = target;
			}
		}
		hasNextPage = result.hasNextPage;
		page += 1;
	}

	cache = { map, expiresAt: now + CACHE_TTL_MS };
	return NextResponse.json(map);
}
