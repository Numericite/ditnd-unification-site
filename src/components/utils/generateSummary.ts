import type { RegisteredLinkProps } from "@codegouvfr/react-dsfr/link";
import sanitize from "sanitize-html";

type Link = {
	text: string;
	linkProps: RegisteredLinkProps;
	subLinks?: Link[];
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
		allowedTags: ["h5"],
		allowedAttributes: {},
	});

	const matches = [...sanitizedHTML.matchAll(/<h5>(.*?)<\/h5>/gi)];

	const res = [
		...matches.map((match) => ({
			linkProps: { href: `#${slugify(match[1])}` },
			text: match[1],
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
