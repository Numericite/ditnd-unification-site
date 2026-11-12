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
			sections: [
				{ blockType: "newsCarousel", visible: true },
				{
					blockType: "personaTiles",
					visible: true,
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
				{
					blockType: "mostViewedGuides",
					visible: true,
					title: "Fiches pratiques les plus lues",
					description:
						"Consultez les guides les plus populaires de notre communauté.",
				},
				{
					blockType: "newsletter",
					visible: true,
					title: "Abonnez-vous à la lettre d'information",
					description:
						"Chaque mois, l'essentiel sur l'autisme et les troubles du neurodéveloppement : évolution de vos droits, démarches administratives, nouvelles ressources et événements de la Maison de l'autisme.",
					consentHint:
						"En renseignant votre adresse électronique, vous acceptez de recevoir la lettre d'information de la Maison de l'autisme. Votre adresse sert uniquement à cet envoi et n'est transmise à aucun tiers. Vous pouvez vous désinscrire à tout moment grâce au lien présent en bas de chaque courriel.",
					socialTitle: null,
					socials: [
						{
							type: "linkedin",
							url: "https://www.linkedin.com/company/maisondelautisme/",
						},
						{
							type: "facebook",
							url: "https://www.facebook.com/maisondelautisme/",
						},
						{
							type: "instagram",
							url: "https://www.instagram.com/lamaisondelautisme/",
						},
						{
							type: "youtube",
							url: "https://www.youtube.com/@Maisondelautisme",
						},
					],
				},
			],
		},
	});

	payload.logger.info("Home content seeded successfully");
}
