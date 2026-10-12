import type { BasePayload } from "payload";

export default async function homeTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "home",
		data: {
			header: {
				title:
					"Site national d'informations pour toutes les personnes concernées par l'autisme et ses troubles associés",
				description:
					"La Maison de l'autisme propose de l'information fiable, de l'écoute, des conseils et des temps d'échange autour de l'autisme et des troubles du neurodéveloppement.",
			},
			tiles: {
				persona: {
					title: "Qui êtes vous?",
					description:
						"Personne concernée par un trouble du neurodéveloppement, proche ou un professionnel, découvrez les parcours personnalisés selon votre profil.",
				},
				condition: {
					title: "Sur quel trouble voulez-vous vous informer ?",
					description:
						"Sélectionnez un trouble pour accéder aux informations et ressources adaptées.",
				},
			},
			mostViewedGuides: {
				title: "Fiches pratiques les plus lues",
				description:
					"Consultez les guides les plus populaires de notre communauté.",
			},
		},
	});

	payload.logger.info("Home content seeded successfully");
}
