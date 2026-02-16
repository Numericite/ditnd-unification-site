import type { RegisteredLinkProps } from "@codegouvfr/react-dsfr/link";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import Avatar from "@codegouvfr/react-dsfr/picto/Avatar";
import HumanCooperation from "@codegouvfr/react-dsfr/picto/HumanCooperation";
import CityHall from "@codegouvfr/react-dsfr/picto/CityHall";
import SelfTraining from "@codegouvfr/react-dsfr/picto/SelfTraining";
import Hospital from "@codegouvfr/react-dsfr/picto/Hospital";
import School from "@codegouvfr/react-dsfr/picto/School";
import Companie from "@codegouvfr/react-dsfr/picto/Companie";
import Ecosystem from "@codegouvfr/react-dsfr/picto/Ecosystem";

import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import type { SerializedLexicalNodeWithParent } from "@payloadcms/richtext-lexical/html";

export type Link = {
	text: string;
	linkProps: RegisteredLinkProps;
	subLinks?: Link[];
};

export type SkipLinkType = {
	label: string;
	anchor: string;
	id?: string | undefined;
};

const MAX_DESCRIPTION_LENGTH = 120;

export const shortenDescription = (string: string) => {
	const isLongerThan = string.length >= MAX_DESCRIPTION_LENGTH;
	return isLongerThan
		? `${string.substring(0, MAX_DESCRIPTION_LENGTH)}...`
		: string;
};

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function generateSummaryFromRichText(
	content: DefaultTypedEditorState,
): Link[] {
	const h2FromNodes = (nodes: any[]) => {
		const links: Link[] = [];

		nodes.forEach((node) => {
			if (node.tag === "h2") {
				const text = extractTextFromNodes(node.children ?? []);

				links.push({
					linkProps: { href: `#${slugify(text)}` },
					text,
				});
			}

			if (node.children) {
				h2FromNodes(node.children);
			}
		});

		return links;
	};

	return h2FromNodes(content.root.children);
}

export function extractTextFromNodes(node: SerializedLexicalNodeWithParent[]) {
	return node.map((child: any) => child.text ?? "").join(" ");
}

export const sanitizeArray = (values: string[]): string[] =>
	Array.from(new Set(values.map((v) => v.trim())));

export const serialize = (values: string[]) => values.join(",");

export const deserialize = (value?: string | string[]) => {
	if (!value) return [];

	return sanitizeArray(typeof value === "string" ? value.split(",") : []);
};

export function courseQuery(
	course: AugmentedCourse,
	condition: string,
	query: string,
) {
	return (
		course.condition.slug.toLowerCase() === condition &&
		(course.description.toLowerCase().includes(query) ||
			course.title.toLowerCase().includes(query) ||
			course.theme.name.toLowerCase().includes(query))
	);
}

export function practicalGuideQuery(
	pg: AugmentedPracticalGuide,
	condition: string,
	query: string,
) {
	return (
		pg.conditions?.some((c) => c.slug.toLowerCase() === condition) &&
		(pg.conditions?.length === 0 ||
			pg.description.toLowerCase().includes(query) ||
			pg.title.toLowerCase().includes(query) ||
			pg.conditions?.some((c) => c.slug.toLowerCase().includes(query)) ||
			pg.themes.some((theme) => theme.name.toLowerCase().includes(query)))
	);
}

export const pictogramMap = {
	Avatar,
	HumanCooperation,
	CityHall,
	SelfTraining,
	Hospital,
	School,
	Companie,
	Ecosystem,
};

export type PictogramName = keyof typeof pictogramMap;

export const personsAndProTiles = (personas: PersonaTile[]) => {
	const mapped = personas.map((persona) => ({
		...persona,
		name: `Je suis ${persona.name}`,
	}));

	const professionalTile: PersonaTile = {
		name: "Je suis un professionnel",
		description: "Description type",
		slug: "professional",
		display: "professional",
		pictogram: "CityHall",
	};

	return [...mapped.slice(0, 2), professionalTile, ...mapped.slice(2)];
};

const searchPageLinks: SkipLinkType[] = [
	{
		anchor: "#contenu",
		label: "Contenu",
	},
	{
		anchor: "#filters",
		label: "Filtres de recherche",
	},
	{
		anchor: "#search-global",
		label: "Recherche",
	},
	{
		anchor: "#footer",
		label: "Pied de page",
	},
];

export const defaultSkipLinks: SkipLinkType[] = [
	{
		anchor: "#main",
		label: "Contenu",
	},
	{
		anchor: "#footer",
		label: "Pied de page",
	},
];

export const skipLinks: Record<string, SkipLinkType[]> = {
	"/": [
		{
			anchor: "#search-global",
			label: "Recherche",
		},
		{
			anchor: "#who",
			label: "Qui êtes vous",
		},
		{
			anchor: "#mostViewed",
			label: "Fiches Pratiques les plus lues",
		},

		{
			anchor: "#footer",
			label: "Pied de page",
		},
	],
	"/guides": searchPageLinks,
	"/guides/...": [
		{
			anchor: "#summary",
			label: "Sommaire",
		},
		{
			anchor: "#wysiwig-content",
			label: "Contenu de la fiche pratique",
		},
		{
			anchor: "#footer",
			label: "Pied de page",
		},
	],
	"/formations": searchPageLinks,
	"/journeys": defaultSkipLinks,
	"/journeys/.../...": [
		{
			anchor: "#summary",
			label: "Sommaire",
		},

		{
			anchor: "#search-global",
			label: "Recherche",
		},
		{
			anchor: "#contenu",
			label: "Contenu",
		},
		{
			anchor: "#footer",
			label: "Pied de page",
		},
	],
};

export const getPathNameForSkipLinks = (pathname: string) => {
	const isTwoLevelJourney = /^\/journeys\/[^/]+\/[^/]+$/.test(pathname);
	const isOneLevelJourney = /^\/journeys\/[^/]+$/.test(pathname);
	const isOneLevelGuide = /^\/guides\/[^/]+$/.test(pathname);

	if (isTwoLevelJourney) return "/journeys/.../...";
	if (isOneLevelJourney) return "/journeys";
	if (isOneLevelGuide) return "/guides/...";
	return pathname;
};
