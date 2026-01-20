import type { RegisteredLinkProps } from "@codegouvfr/react-dsfr/link";
import sanitize from "sanitize-html";

type Link = {
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

const maxDescriptionLength = 250;

export const shortenDescription = (string: string) => {
	const isLongerThan = string.length >= maxDescriptionLength;
	return isLongerThan ? `${string.substring(0, 250)}...` : string;
};

export function slugify(text: string | undefined) {
	if (!text) return;
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
			linkProps: { href: `#${slugify(title)}` },
			text: title,
		})),
		{
			linkProps: { href: "#fiches-pratiques" },
			text: "Ces fiches pratiques qui pourraient vous intéresser",
		},
		{
			linkProps: { href: "#formations" },
			text: "Ces formations qui pourraient vous intéresser",
		},
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
