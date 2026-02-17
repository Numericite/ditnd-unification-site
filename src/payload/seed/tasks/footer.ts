import type { BasePayload } from "payload";
import { legalsContent } from "~/utils/wysiwyg-content";

export default async function footerTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "footer",
		data: {
			title:
				"Délégation interministérielle pour les troubles du neurodéveloppement",
			accessibility: {
				title: "Accessibilité",
				content: legalsContent.accessibility,
			},
			legalNotice: {
				title: "Mention légales",
				content: legalsContent.legalNotice,
			},
			cgu: {
				title: "Politique de confidentialité",
				content: legalsContent.cgu,
			},
			termsOfUse: {
				title: "Modalités d'utilisation",
				content: legalsContent.termsOfUse,
			},
		},
	});

	payload.logger.info("Legals content seeded successfully");
}
