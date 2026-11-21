import type { GetServerSideProps } from "next";

/**
 * robots.txt dynamique : tout est interdit tant que NEXT_PUBLIC_NOINDEX=true
 * (préprod), sinon crawl autorisé hors admin/API, avec référence au sitemap.
 */

const RobotsTxt = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const siteUrl = (
		process.env.NEXT_PUBLIC_SITE_URL || "https://maisondelautisme.gouv.fr"
	).replace(/\/$/, "");

	const body =
		process.env.NEXT_PUBLIC_NOINDEX === "true"
			? "User-agent: *\nDisallow: /\n"
			: // Les médias Payload sont servis sous /api/medias/file/ : on les
				// laisse crawlables (Google Images, rendu des pages, PDF).
				`User-agent: *\nAllow: /api/medias/file/\nDisallow: /admin\nDisallow: /api\nDisallow: /draft\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

	res.setHeader("Content-Type", "text/plain");
	res.setHeader("Cache-Control", "public, s-maxage=3600");
	res.write(body);
	res.end();

	return { props: {} };
};

export default RobotsTxt;
