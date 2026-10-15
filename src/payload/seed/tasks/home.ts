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
			contact: {
				phone: {
					title: "Par téléphone",
					number: "0 800 71 40 40",
					label: "Service et appel gratuits",
					scheduleNote: "Appel gratuit depuis un fixe ou un mobile.",
					schedule: {
						lundi: { closed: false, openTime: "9h", closeTime: "18h" },
						mardi: { closed: false, openTime: "9h", closeTime: "18h" },
						mercredi: { closed: false, openTime: "9h", closeTime: "18h" },
						jeudi: { closed: false, openTime: "9h", closeTime: "18h" },
						vendredi: { closed: false, openTime: "9h", closeTime: "18h" },
						samedi: { closed: false, openTime: "9h", closeTime: "12h" },
						dimanche: { closed: true },
					},
				},
				contactForm: {
					title: "Par écrit",
					description:
						"Posez votre question via notre formulaire de contact, disponible 24h/24 et 7j/7.",
					buttonLabel: "Écrire au service",
					url: "/contact",
				},
				directory: {
					title: "Annuaire",
					description:
						"Trouvez les structures et les professionnels près de chez vous.",
					buttonLabel: "Consulter l'annuaire",
					url: "https://annuaire.maisondelautisme.gouv.fr",
				},
			},
		},
	});

	payload.logger.info("Home content seeded successfully");
}
