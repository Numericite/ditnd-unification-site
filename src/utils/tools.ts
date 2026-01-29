import type { RegisteredLinkProps } from "@codegouvfr/react-dsfr/link";
import sanitize from "sanitize-html";

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

export const toArray = (value?: string | string[]) => {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
};
