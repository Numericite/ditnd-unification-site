import type { BasePayload } from "payload";
import { legalsContent } from "~/utils/wysiwyg-content";

export default async function footerTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "footer",
		data: {
			title:
				"Maison de l'autisme - Site national d'informations sur l'autisme et les troubles du neurodéveloppement",
			accessibility: {
				title: "Accessibilité",
				content: legalsContent.accessibility,
			},
			legalNotice: {
				title: "Mentions légales",
				content: legalsContent.legalNotice,
			},
			cgu: {
				title: "Données personnelles",
				content: legalsContent.cgu,
			},
			termsOfUse: {
				title: "Modalités d'utilisation",
				content: legalsContent.termsOfUse,
			},
			contactProsCra: {
				title: "Formulaire de contact réservé aux professionnels des CRA",
				content: legalsContent.contactProsCra,
			},
		},
	});

	payload.logger.info("Legals content seeded successfully");
}
