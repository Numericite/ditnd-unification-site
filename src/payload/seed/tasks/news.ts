import type { Payload } from "payload";
import { TRPCError } from "@trpc/server";

const newsItems = [
	{
		title: "ANPAF : retours d'expérience 2026 et perspectives 2027",
		slug: "anpaf-retours-experience-2026-perspectives-2027",
		description:
			"Depuis mars 2026, le GNCRA déploie l'Attestation Nationale Pair Aidant Familial (ANPAF) TSA au sein des TND. Ce webinaire présentera les retours d'expérience de la 1re promotion et les perspectives d'ouverture de la session 2027.",
		category: "Événement",
		link: {
			url: "https://maisondelautisme.gouv.fr",
			label: "S'inscrire au webinaire",
		},
		image: 1,
		personas: [3, 1],
	},
	{
		title:
			"Nouveau parcours de formation pour les professionnels de l'éducation",
		slug: "formation-professionnels-education",
		description:
			"Un parcours en ligne gratuit est désormais disponible pour aider les enseignants et personnels éducatifs à mieux accompagner les élèves avec un TND.",
		category: "Formation",
		link: {
			url: "https://maisondelautisme.gouv.fr",
			label: "Accéder au parcours",
		},
		image: 2,
		personas: [4],
	},
	{
		title: "Semaine européenne pour l'emploi des personnes handicapées 2026",
		slug: "seeph-2026",
		description:
			"Du 16 au 20 novembre, la SEEPH met à l'honneur l'inclusion professionnelle des personnes autistes et TND. Retrouvez les événements près de chez vous.",
		category: "Événement",
		image: 3,
		personas: [],
	},
];

async function createNews(
	payload: Payload,
	data: {
		title: string;
		slug: string;
		description: string;
		category: string;
		link?: { url: string; label: string };
		image: number;
		personas: number[];
	},
): Promise<void> {
	try {
		await payload.create({
			collection: "news",
			data: { ...data, _status: "published" },
		});
	} catch (error) {
		throw new TRPCError({
			message: `Error creating news "${data.title}" with error ${error}`,
			code: "INTERNAL_SERVER_ERROR",
		});
	}
}

export async function seedNews(payload: Payload) {
	for (const item of newsItems) {
		await createNews(payload, item);
	}
}
