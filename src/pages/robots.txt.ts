import type { GetServerSideProps } from "next";

/**
 * robots.txt dynamique : tout est interdit tant que NEXT_PUBLIC_NOINDEX=true
 * (préprod), sinon crawl autorisé hors admin/API, avec référence au sitemap.
 * Les agents IA sont listés explicitement pour rendre l'autorisation visible.
 */

const AI_USER_AGENTS = [
	"GPTBot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"ClaudeBot",
	"Claude-SearchBot",
	"Claude-User",
	"PerplexityBot",
	"Perplexity-User",
	"Google-Extended",
	"Applebot-Extended",
	"Mistral-User",
];

const DISALLOWED_PATHS = ["/admin", "/api", "/draft"];

const RobotsTxt = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const siteUrl = (
		process.env.NEXT_PUBLIC_SITE_URL || "https://maisondelautisme.gouv.fr"
	).replace(/\/$/, "");

	const body =
		process.env.NEXT_PUBLIC_NOINDEX === "true"
			? "User-agent: *\nDisallow: /\n"
			: [
					...["*", ...AI_USER_AGENTS].map((agent) => `User-agent: ${agent}`),
					"Allow: /",
					...DISALLOWED_PATHS.map((path) => `Disallow: ${path}`),
					"",
					`Sitemap: ${siteUrl}/sitemap.xml`,
					"",
				].join("\n");

	res.setHeader("Content-Type", "text/plain");
	res.setHeader("Cache-Control", "public, s-maxage=3600");
	res.write(body);
	res.end();

	return { props: {} };
};

export default RobotsTxt;
