import type { RegisteredLinkProps } from "@codegouvfr/react-dsfr/link";
import sanitize from "sanitize-html";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

export type Link = {
	text: string;
	linkProps: RegisteredLinkProps;
	subLinks?: Link[];
};

function extractText(html: string): string {
	return sanitize(html, {
		allowedTags: [],
		allowedAttributes: {},
	});
}

const MAX_DESCRIPTION_LENGTH = 250;

export const shortenDescription = (string: string) => {
	const isLongerThan = string.length >= MAX_DESCRIPTION_LENGTH;
	return isLongerThan ? `${string.substring(0, 250)}...` : string;
};

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export default function generateSummary(html: string): Link[] {
	const sanitizedHTML = sanitize(html, {
		allowedTags: ["h2"],
		allowedAttributes: {},
	});

	const matches = [...sanitizedHTML.matchAll(/<h2>(.*?)<\/h2>/gi)];

	const res = [
		...matches.map(([, title]) => ({
			linkProps: { href: `#${title ? slugify(title) : ""}` },
			text: title,
		})),
	] as Link[];

	return res;
}

export function addAnchors(html: string) {
	return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_, attrs, innerHTML) => {
		const text = extractText(innerHTML);
		const id = slugify(text);
		return `<h2${attrs} id="${id}">${innerHTML}</h2>`;
	});
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
