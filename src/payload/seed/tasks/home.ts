import type { BasePayload } from "payload";

// Stores an HH:MM time in Paris time, as the admin time picker does
const time = (hhmm: string) =>
	new Date(`2026-01-01T${hhmm}:00+01:00`).toISOString();

export default async function homeTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "home",
		data: {
			header: {
				title:
					"Site national d’informations\nsur l’autisme et ses troubles associés",
				description:
					"Informations et ressources validées par des experts, à destination des personnes concernées, leurs proches et les professionnels.",
			},
			sections: [
				{
					blockType: "contact",
					visible: true,
					phone: {
						title: "Par téléphone",
						number: "0 800 71 40 40",
						label: "Service et appel gratuits",
						scheduleNote: "Appel gratuit depuis un fixe ou un mobile.",
						schedule: {
							lundi: {
								closed: false,
								openTime: time("09:00"),
								closeTime: time("18:00"),
							},
							mardi: {
								closed: false,
								openTime: time("09:00"),
								closeTime: time("18:00"),
							},
							mercredi: {
								closed: false,
								openTime: time("09:00"),
								closeTime: time("18:00"),
							},
							jeudi: {
								closed: false,
								openTime: time("09:00"),
								closeTime: time("18:00"),
							},
							vendredi: {
								closed: false,
								openTime: time("09:00"),
								closeTime: time("18:00"),
							},
							samedi: {
								closed: false,
								openTime: time("09:00"),
								closeTime: time("12:00"),
							},
							dimanche: { closed: true },
						},
					},
					contactForm: {
						title: "Par écrit",
						description:
							"Posez votre question via notre formulaire de contact, disponible 24h/24 et 7j/7.",
						buttonLabel: "Écrire au service",
						url: "/contact-particuliers",
					},
					directory: {
						title: "Annuaire",
						description:
							"Trouvez les structures et les professionnels près de chez vous.",
						buttonLabel: "Consulter l'annuaire",
						url: "https://annuaire.autismeinfoservice.fr/",
					},
				},
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
