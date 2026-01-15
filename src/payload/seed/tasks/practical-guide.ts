import type { Payload } from "payload";
import { TRPCError } from "@trpc/server";
import type { Course } from "../../payload-types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

const content: DefaultTypedEditorState[] = [
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			children: [
				{
					type: "heading",
					tag: "h2",
					format: "",
					indent: 0,
					version: 1,
					children: [
						{
							type: "text",
							text: "L'autisme expliqué aux familles",
							detail: 0,
							format: 0,
							mode: "normal",
							style: "",
							version: 1,
						},
					],
					direction: null,
				},
			],
			direction: null,
		},
	},
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			children: [
				{
					type: "heading",
					tag: "h2",
					format: "",
					indent: 0,
					version: 1,
					children: [
						{
							type: "text",
							text: "Manifestations possibles selon l'âge",
							detail: 0,
							format: 0,
							mode: "normal",
							style: "",
							version: 1,
						},
					],
					direction: null,
				},
			],
			direction: null,
		},
	},
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			children: [
				{
					type: "heading",
					tag: "h2",
					format: "",
					indent: 0,
					version: 1,
					children: [
						{
							type: "text",
							text: "Le lycée constitue une étape cruciale pour l'élève avec un TDAH puisqu'il définit ses goûts et ses aptitudes et commence à tracer son parcours étudiant et professionnel. Quels sont les dispositifs existants pour lui permettre...",
							detail: 0,
							format: 0,
							mode: "normal",
							style: "",
							version: 1,
						},
					],
					direction: null,
				},
			],
			direction: null,
		},
	},
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			children: [
				{
					type: "heading",
					tag: "h2",
					format: "",
					indent: 0,
					version: 1,
					children: [
						{
							type: "text",
							text: "Le lycée constitue une étape cruciale pour l'élève avec un TDAH puisqu'il définit ses goûts et ses aptitudes et commence à tracer son parcours étudiant et professionnel. Quels sont les dispositifs existants pour lui permettre...",
							detail: 0,
							format: 0,
							mode: "normal",
							style: "",
							version: 1,
						},
					],
					direction: null,
				},
			],
			direction: null,
		},
	},
];

const guides = [
	{
		title: "L'autisme expliqué aux familles",
		slug: "autisme_explique_aux_familles",
		description:
			"Un éclairage sur ce qu'est l'autisme, adapté aux parents et proches, pour mieux comprendre les besoins de leur enfant.",
		conditions: [6],
		persona: [1],
		themes: [1],
	},
	{
		title: "Manifestations possibles selon l'âge",
		slug: "manifestations_possibles_selon_lage",
		description:
			"Comment l'autisme peut apparaître différemment chez un jeune enfant, un adolescent ou un adulte.",
		conditions: [6],
		persona: [1],
		themes: [2],
	},
	{
		title: "Aller au lycée quand on a un TDAH",
		slug: "aller_au_lycee_quand_on_a_un_tdah",
		description:
			"Le lycée constitue une étape cruciale pour l'élève avec un TDAH puisqu'il définit ses goûts et ses aptitudes et commence à tracer son parcours étudiant et professionnel. Quels sont les dispositifs existants pour lui permettre...",
		conditions: [4],
		persona: [2],
		themes: [8],
	},
	{
		title: "Parcours de diagnostic DYS",
		slug: "parcours_de_diagnostic_dys",
		description:
			"Comment entamer un parcours de diagnostic d'un trouble DYS ? Vous vous posez des questions sur le développement de votre enfant ? En tant qu'adulte vous n'arrivez pas expliquer certaines de vos difficultés et ...",
		conditions: [7],
		persona: [2],
		themes: [6],
	},
];

async function createPracticalGuide(
	payload: Payload,
	data: {
		title: string;
		slug: string;
		description: string;
		conditions?: number[];
		content: DefaultTypedEditorState;
		html: string;
		persona: number[];
		themes: number[];
		practicalGuide?: number;
		courses?: Course[];
	},
): Promise<void> {
	try {
		await payload.create({
			collection: "practical-guides",
			data,
		});
	} catch (error) {
		throw new TRPCError({
			message: `Error creating practical guides ${data.title} with error ${error}`,
			code: "INTERNAL_SERVER_ERROR",
		});
	}
}

export async function seedPracticalGuides(payload: Payload) {
	for (let i = 0; i < guides.length; i++) {
		const guide = guides[i];
		const textContent = content[i];

		if (!guide) {
			throw new Error(`Missing guide at index ${i}`);
		}

		if (!textContent) {
			throw new Error(`Missing content at index ${i}`);
		}

		await createPracticalGuide(payload, {
			...guide,
			content: textContent,
			html: convertLexicalToHTML({ data: textContent }),
		});
	}
}
