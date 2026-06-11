import type { GetServerSideProps } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Sitemap dynamique généré depuis Payload. Soumis à la Search Console au
 * lancement pour accélérer la réindexation post-migration —
 * voir docs/plan-redirections-seo.md.
 */

const STATIC_PATHS = [
	"/",
	"/fiches-pratiques",
	"/formations",
	"/a-propos",
	"/a-propos/maison-de-l-autisme",
	"/a-propos/cras",
	"/a-propos/gncra",
	"/a-propos/glossaire",
	"/contact-particuliers",
	"/contact-pros-cra",
	"/accessibilite",
	"/mentions-legales",
	"/plan-du-site",
];

const buildXml = (siteUrl: string, paths: string[]): string => {
	const urls = paths
		.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`)
		.join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
};

const SitemapXml = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const siteUrl = (
		process.env.NEXT_PUBLIC_SITE_URL || "https://maisondelautisme.gouv.fr"
	).replace(/\/$/, "");

	const payload = await getPayload({ config });

	const [guides, courses, personas, conditions] = await Promise.all([
		payload.find({
			collection: "practical-guides",
			where: { _status: { equals: "published" } },
			limit: 1000,
			pagination: false,
			select: { slug: true },
		}),
		payload.find({
			collection: "courses",
			limit: 1000,
			pagination: false,
			select: { slug: true },
		}),
		payload.find({
			collection: "personas",
			limit: 100,
			pagination: false,
			select: { slug: true },
		}),
		payload.find({
			collection: "conditions",
			limit: 100,
			pagination: false,
			select: { slug: true },
		}),
	]);

	const slugsOf = (docs: Array<{ slug?: string | null }>) =>
		docs.map((doc) => doc.slug).filter((slug): slug is string => Boolean(slug));

	const paths = [
		...STATIC_PATHS,
		...slugsOf(guides.docs).map((slug) => `/fiches-pratiques/${slug}`),
		...slugsOf(courses.docs).map((slug) => `/formations/${slug}`),
		...slugsOf(personas.docs).flatMap((persona) => [
			`/parcours/${persona}`,
			...slugsOf(conditions.docs).map(
				(condition) => `/parcours/${persona}/${condition}`,
			),
		]),
	];

	res.setHeader("Content-Type", "application/xml");
	res.setHeader(
		"Cache-Control",
		"public, s-maxage=3600, stale-while-revalidate=86400",
	);
	res.write(buildXml(siteUrl, paths));
	res.end();

	return { props: {} };
};

export default SitemapXml;
