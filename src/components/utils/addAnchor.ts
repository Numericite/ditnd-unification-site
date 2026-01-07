import { slugify } from "./generateSummary";

export function addAnchors(html: string) {
	return html.replace(/<h5([^>]*)>(.*?)<\/h5>/gi, (_, attrs, title) => {
		const id = slugify(title);
		return `<h5${attrs} id="${id}">${title}</h5>`;
	});
}
