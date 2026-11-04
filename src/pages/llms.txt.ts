import type { GetServerSideProps } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * llms.txt dynamique (https://llmstxt.org) : index Markdown des contenus
 * publiés, à destination des moteurs de réponse IA.
 */

const STATIC_PAGES: Array<[label: string, path: string]> = [
	["Fiches pratiques", "/fiches-pratiques"],
	["Formations", "/formations"],
	["La Maison de l'autisme", "/a-propos/maison-de-l-autisme"],
	["Les Centres Ressources Autisme (CRA)", "/a-propos/cra"],
	["Le GNCRA", "/a-propos/gncra"],
	["Glossaire", "/a-propos/glossaire"],
	["Contact particuliers", "/contact-particuliers"],
	["Contact professionnels et CRA", "/contact-pros-cra"],
];

type Entry = {
	title?: string | null;
	slug?: string | null;
	description?: string | null;
};

const toLines = (siteUrl: string, basePath: string, docs: Entry[]) =>
	docs
		.filter((doc) => doc.slug && doc.title)
		.map((doc) => {
			const description = doc.description?.replace(/\s+/g, " ").trim();
			const link = `- [${doc.title?.trim()}](${siteUrl}${basePath}/${doc.slug})`;
			return description ? `${link}: ${description}` : link;
		});

const LlmsTxt = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const siteUrl = (
		process.env.NEXT_PUBLIC_SITE_URL || "https://maisondelautisme.gouv.fr"
	).replace(/\/$/, "");

	const payload = await getPayload({ config });

	const [guides, courses] = await Promise.all([
		payload.find({
			collection: "practical-guides",
			where: { _status: { equals: "published" } },
			limit: 1000,
			pagination: false,
			sort: "title",
			select: { title: true, slug: true, description: true },
		}),
		payload.find({
			collection: "courses",
			where: { _status: { equals: "published" } },
			limit: 1000,
			pagination: false,
			sort: "title",
			select: { title: true, slug: true, description: true },
		}),
	]);

	const body = [
		"# Maison de l'autisme",
		"",
		"> Site national d'informations pour toutes les personnes concernées par l'autisme et les troubles du neurodéveloppement (TND) : fiches pratiques, formations et orientation vers les Centres Ressources Autisme.",
		"",
		"## Fiches pratiques",
		"",
		...toLines(siteUrl, "/fiches-pratiques", guides.docs),
		"",
		"## Formations",
		"",
		...toLines(siteUrl, "/formations", courses.docs),
		"",
		"## Pages",
		"",
		...STATIC_PAGES.map(([label, path]) => `- [${label}](${siteUrl}${path})`),
		"",
	].join("\n");

	res.setHeader("Content-Type", "text/markdown; charset=utf-8");
	res.setHeader(
		"Cache-Control",
		"public, s-maxage=3600, stale-while-revalidate=86400",
	);
	res.write(body);
	res.end();

	return { props: {} };
};

export default LlmsTxt;
