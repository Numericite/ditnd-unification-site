import type { RegisteredLinkProps } from "@codegouvfr/react-dsfr/link";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

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
};

const MAX_DESCRIPTION_LENGTH = 120;

export const shortenDescription = (string: string) => {
	const isLongerThan = string.length >= MAX_DESCRIPTION_LENGTH;
	return isLongerThan
		? `${string.substring(0, MAX_DESCRIPTION_LENGTH)}...`
		: string;
};

export function normalizeForSearch(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

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
		pg.conditions?.length === 0 ||
		(pg.conditions?.some((c) => c.slug.toLowerCase() === condition) &&
			(pg.description.toLowerCase().includes(query) ||
				pg.title.toLowerCase().includes(query) ||
				pg.conditions?.some((c) => c.slug.toLowerCase().includes(query)) ||
				pg.themes.some((theme) => theme.name.toLowerCase().includes(query))))
	);
}

export const skipLinks: SkipLinkType[] = [
	{
		anchor: "#contenu",
		label: "Vers le contenu principal",
	},
	{
		anchor: "#menu",
		label: "Aller au menu",
	},
	{
		anchor: "#search-global",
		label: "Aller à la recherche",
	},
	{
		anchor: "#chatbot",
		label: "Aller à l'assistant conversationnel",
	},
];

const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHexColor(value: unknown): boolean {
	return typeof value === "string" && HEX_COLOR_REGEX.test(value);
}

export const validateHexColor = (value: unknown) => {
	if (typeof value !== "string" || value.length === 0) return true;
	return isHexColor(value)
		? true
		: "Format de couleur invalide. Utilisez le format #RRGGBB ou #RGB.";
};

export const ImageSizes = [
	{
		name: "thumbnail",
		width: 300,
		withoutEnlargement: true,
	},
	{
		name: "square",
		width: 500,
		height: 500,
		withoutEnlargement: true,
	},
	{
		name: "small",
		width: 600,
		withoutEnlargement: true,
	},
	{
		name: "medium",
		width: 900,
		withoutEnlargement: true,
	},
	{
		name: "large",
		width: 1400,
		withoutEnlargement: true,
	},
	{
		name: "banner",
		width: 1240,
		height: 240,
		withoutEnlargement: true,
	},
];

export function extractYouTubeId(url: string): string | null {
	try {
		const parsed = new URL(url);

		if (parsed.hostname === "youtu.be") {
			return parsed.pathname.split("/")[1] || null;
		}

		if (parsed.searchParams.get("v")) {
			return parsed.searchParams.get("v");
		}

		return null;
	} catch {
		return null;
	}
}
