import type { Payload } from "payload";
import { TRPCError } from "@trpc/server";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { PracticalGuidesContent } from "~/utils/wysiwyg-content";

const content = PracticalGuidesContent;

const guides = [
	{
		title: "L'autisme expliqué aux familles",
		slug: "autisme_explique_aux_familles",
		description:
			"Un éclairage sur ce qu'est l'autisme, adapté aux parents et proches, pour mieux comprendre les besoins de leur enfant.",
		conditions: [4],
		persona: [1],
		themes: [1, 4],
		practicalGuides: [2, 3],
		courses: [2, 3],
		viewCount: 50,
	},
	{
		title: "Manifestations possibles selon l'âge",
		slug: "manifestations_possibles_selon_lage",
		description:
			"Comment l'autisme peut apparaître différemment chez un jeune enfant, un adolescent ou un adulte.",
		conditions: [],
		persona: [1],
		themes: [2],
		viewCount: 39,
	},
	{
		title: "Aller au lycée quand on a un TDAH",
		slug: "aller_au_lycee_quand_on_a_un_tdah",
		description:
			"Le lycée constitue une étape cruciale pour l'élève avec un TDAH puisqu'il définit ses goûts et ses aptitudes et commence à tracer son parcours étudiant et professionnel. Quels sont les dispositifs existants pour lui permettre...",
		conditions: [4],
		persona: [2],
		themes: [8],
		viewCount: 56,
	},
	{
		title: "Parcours de diagnostic DYS",
		slug: "parcours_de_diagnostic_dys",
		description:
			"Comment entamer un parcours de diagnostic d'un trouble DYS ? Vous vous posez des questions sur le développement de votre enfant ? En tant qu'adulte vous n'arrivez pas expliquer certaines de vos difficultés et ...",
		conditions: [5],
		persona: [2],
		themes: [6],
		viewCount: 43,
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
		practicalGuides?: number[];
		courses?: number[];
		viewCount: number;
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
