import type { BasePayload } from "payload";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

const textNode = (text: string) =>
	({
		mode: "normal",
		text,
		type: "text",
		style: "",
		detail: 0,
		format: 0,
		version: 1,
	}) as const;

const paragraph = (text: string) =>
	({
		type: "paragraph",
		format: "",
		indent: 0,
		version: 1,
		children: [textNode(text)],
		direction: null,
		textStyle: "",
		textFormat: 0,
	}) as const;

const h2 = (text: string) =>
	({
		tag: "h2",
		type: "heading",
		format: "",
		indent: 0,
		version: 1,
		children: [textNode(text)],
		direction: null,
	}) as const;

const buildContent = (
	sections: { title: string; paragraphs: string[] }[],
): DefaultTypedEditorState =>
	({
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			children: sections.flatMap((section) => [
				h2(section.title),
				...section.paragraphs.map(paragraph),
			]),
			direction: null,
		},
	}) as unknown as DefaultTypedEditorState;

const LOREM_SHORT =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const LOREM_LONG =
	"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus, nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.";

const maisonDeLAutismeContent = buildContent([
	{
		title: "Présentation de la Maison de l'autisme",
		paragraphs: [LOREM_SHORT, LOREM_LONG],
	},
	{
		title: "Nos missions",
		paragraphs: [LOREM_LONG, LOREM_SHORT],
	},
	{
		title: "Nos services",
		paragraphs: [LOREM_SHORT],
	},
	{
		title: "Nous contacter",
		paragraphs: [LOREM_SHORT],
	},
]);

const gncraContent = buildContent([
	{
		title: "Le Groupement National des Centres Ressources Autisme",
		paragraphs: [LOREM_LONG, LOREM_SHORT],
	},
	{
		title: "Le rôle du GNCRA",
		paragraphs: [LOREM_SHORT, LOREM_LONG],
	},
	{
		title: "Actions et projets",
		paragraphs: [LOREM_LONG],
	},
	{
		title: "Partenaires",
		paragraphs: [LOREM_SHORT],
	},
]);

const crasContent = buildContent([
	{
		title: "Les Centres Ressources Autisme",
		paragraphs: [LOREM_LONG, LOREM_SHORT],
	},
	{
		title: "Missions des CRA",
		paragraphs: [LOREM_SHORT, LOREM_LONG],
	},
	{
		title: "Implantation territoriale",
		paragraphs: [LOREM_LONG],
	},
	{
		title: "Accéder à un CRA près de chez vous",
		paragraphs: [LOREM_SHORT],
	},
]);

export default async function aboutTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "about",
		data: {
			maisonDeLAutisme: {
				title: "Maison de l'autisme",
				imageBanner: 7,
				content: maisonDeLAutismeContent,
			},
			gncra: {
				title: "GNCRA - Groupement National des Centres Ressources Autisme",
				imageBanner: 1,
				content: gncraContent,
			},
			cras: {
				title: "CRAs - Centres Ressources Autisme",
				imageBanner: 4,
				content: crasContent,
			},
		},
	});

	payload.logger.info("About content seeded successfully");
}
