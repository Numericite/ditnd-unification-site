import configPromise from "@payload-config";
import type { Redirect as NextRedirect } from "next";
import { getPayload } from "payload";
import type { Redirect } from "~/payload/payload-types";
import {
	REFERENCE_POPULATE,
	normalizePath,
	referenceHref,
} from "~/utils/links";
import { SECTION_FALLBACKS } from "~/utils/redirects";

/**
 * Redirections 301 des URLs de l'ancien site WordPress, résolues dans le
 * getServerSideProps des pages qui renverraient sinon une 404.
 * Voir docs/plan-redirections-seo.md.
 *
 *  1. correspondance exacte dans la collection Payload "redirects" ;
 *  2. fallbacks de section pour les anciennes URLs sans équivalent ;
 *  3. sinon, 404.
 *
 * La query string est transférée vers la cible. Le slash final est déjà
 * retiré par Next (308 natif) en amont.
 */

const resolveTarget = (to: Redirect["to"] | undefined): string | null => {
	if (!to) return null;
	if (to.type === "custom") return to.url?.trim() || null;
	return referenceHref(to.reference);
};

const withQuery = (target: string, resolvedUrl: string): string => {
	const query = new URLSearchParams(resolvedUrl.split("?")[1] ?? "");
	if (query.size === 0) return target;
	const url = new URL(target, "http://placeholder");
	query.forEach((value, key) => {
		if (!url.searchParams.has(key)) url.searchParams.append(key, value);
	});
	return target.startsWith("http")
		? url.toString()
		: `${url.pathname}${url.search}`;
};

export const findLegacyRedirect = async (
	resolvedUrl: string,
): Promise<string | null> => {
	const from = normalizePath(resolvedUrl);
	const payload = await getPayload({ config: configPromise });
	const { docs } = await payload.find({
		collection: "redirects",
		where: { from: { equals: from } },
		depth: 2,
		populate: REFERENCE_POPULATE,
		limit: 1,
		overrideAccess: true,
	});

	const target =
		resolveTarget(docs[0]?.to) ??
		SECTION_FALLBACKS.find(
			([prefix]) => from === prefix || from.startsWith(`${prefix}/`),
		)?.[1] ??
		null;
	if (!target) return null;
	if (!target.startsWith("http") && normalizePath(target) === from) {
		return null;
	}
	return withQuery(target, resolvedUrl);
};

export const legacyRedirect = async (
	resolvedUrl: string,
): Promise<{ redirect: NextRedirect } | null> => {
	const destination = await findLegacyRedirect(resolvedUrl);
	return destination ? { redirect: { destination, statusCode: 301 } } : null;
};
