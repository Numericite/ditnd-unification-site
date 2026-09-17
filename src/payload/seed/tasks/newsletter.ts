import type { BasePayload } from "payload";

export default async function newsletterTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "newsletter",
		data: {
			enabled: true,
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
				{ type: "facebook", url: "https://www.facebook.com/maisondelautisme/" },
				{
					type: "instagram",
					url: "https://www.instagram.com/lamaisondelautisme/",
				},
				{ type: "youtube", url: "https://www.youtube.com/@Maisondelautisme" },
			],
		},
	});

	payload.logger.info("Newsletter content seeded successfully");
}
