import type { BasePayload } from "payload";
import { DEFAULT_FOOTER_LINKS } from "~/utils/footer";
import { legalsContent } from "~/utils/wysiwyg-content";

export default async function footerTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "footer",
		data: {
			title:
				"Maison de l'autisme - Site national d'informations sur l'autisme et ses troubles associés",
			accessibility: {
				title: "Accessibilité",
				content: legalsContent.accessibility,
			},
			legalNotice: {
				title: "Mentions légales",
				content: legalsContent.legalNotice,
			},
			personalData: {
				title: "Données personnelles et cookies",
				content: legalsContent.personalData,
			},
			bottomLinks: DEFAULT_FOOTER_LINKS.map(({ title, internalUrl }) => ({
				title,
				link: { type: "internal" as const, internalUrl },
			})),
		},
	});

	payload.logger.info("Legals content seeded successfully");
}
