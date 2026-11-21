import type { GetServerSideProps } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Sitemap temporaire des anciennes URLs WordPress (collection "redirects").
 * Soumis à la Search Console au lancement pour que Google recrawle vite les
 * anciennes URLs, voie les 301 et transfère leur référencement. Non déclaré
 * dans robots.txt : à retirer de la Search Console après 4 à 8 semaines.
 * Voir docs/plan-redirections-seo.md.
 */

// Date de bascule : un <lastmod> récent incite Google à recrawler.
const LAUNCH_DATE = "2026-11-23";

const escapeXml = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

const SitemapAnciennesUrls = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const siteUrl = (
		process.env.NEXT_PUBLIC_SITE_URL || "https://maisondelautisme.gouv.fr"
	).replace(/\/$/, "");

	const payload = await getPayload({ config });
	const { docs } = await payload.find({
		collection: "redirects",
		limit: 1000,
		pagination: false,
		select: { from: true },
		overrideAccess: true,
	});

	// Les clés `from` sont stockées sans slash final ; l'ancien site WordPress
	// en mettait un, et c'est sous cette forme que Google les a indexées.
	const urls = docs
		.map((doc) => doc.from)
		.filter((from): from is string => Boolean(from) && from !== "/")
		.map(
			(from) =>
				`  <url><loc>${escapeXml(`${siteUrl}${from}/`)}</loc><lastmod>${LAUNCH_DATE}</lastmod></url>`,
		)
		.join("\n");

	res.setHeader("Content-Type", "application/xml");
	res.setHeader("Cache-Control", "public, s-maxage=3600");
	res.write(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
	);
	res.end();

	return { props: {} };
};

export default SitemapAnciennesUrls;
