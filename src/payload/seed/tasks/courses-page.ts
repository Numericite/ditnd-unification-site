import type { BasePayload } from "payload";

export default async function coursesPageTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "courses-page",
		data: {
			platforms: {
				title: "Les plateformes de formation",
				description:
					"Trois portes d'entrée pour vous former : notre catalogue de formations sélectionnées par notre commission, et les plateformes de nos partenaires.",
				featured: {
					badge: "Maison de l'autisme",
					title: "Le catalogue de la Maison de l'autisme",
					image: 8,
					description:
						"Des formations proposées par des organismes, évaluées par les membres de notre commission puis référencées. Filtrez par trouble, thématique, public et format (formation en ligne, webinaire, présentiel).",
					link: {
						label: "Voir le catalogue des formations",
						url: "/formations",
					},
				},
				left: {
					badge: "Campus du GNCRA",
					title: "Comprendre, apprendre et mieux accompagner.",
					image: 9,
					description:
						"Des formations sur l'autisme et les troubles du neurodéveloppement, conçues avec des experts nationaux. Campus est une plateforme de formations en ligne, créée par le Groupement national des centres ressources autisme (GNCRA). Vous y trouverez des modules de formation en ligne co-conçus par le GNCRA et le réseau des CRA, à destination des différents publics concernés par les TND.",
					link: {
						label: "Accéder au Campus",
						url: "https://campus.gncra.fr/",
					},
				},
				right: {
					badge: "CRA PACA",
					title:
						"Rendre la montée en compétences plus accessible, cohérente et adaptée au terrain.",
					description:
						"PASS Autisme offre un accès personnalisé, progressif et continu à la formation dans le but de renforcer les compétences et connaissances des professionnels et des proches accompagnant des personnes avec un trouble du spectre de l'autisme (TSA).",
					link: {
						label: "Découvrir PASS Autisme",
						url: "https://cra-paca.centredoc.fr/",
					},
				},
			},
			selection: {
				title: "Comment sont sélectionnées nos formations ?",
				description:
					"Avant d'être référencée dans notre annuaire, chaque formation est évaluée en trois étapes.",
				steps: [
					{
						title: "L'organisme propose sa formation à référencer",
						description:
							"L'organisme de formation soumet l'ensemble des pièces à la commission.",
					},
					{
						title: "Les membres de la commission l'évaluent",
						description:
							"Chaque membre de la commission analyse via une grille de repère.",
					},
					{
						title: "La commission délibère et arbitre",
						description: "La formation est ensuite référencée dans l'annuaire",
					},
				],
				link: {
					label: "En savoir plus sur les critères de sélection",
					url: "/formations",
				},
			},
		},
	});

	payload.logger.info("Courses page content seeded successfully");
}
