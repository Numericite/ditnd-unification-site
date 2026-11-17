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
		},
	});

	payload.logger.info("Home content seeded successfully");
}
