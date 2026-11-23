import type { BasePayload } from "payload";
import { legalsContent } from "~/utils/wysiwyg-content";

const contactPages = [
	{
		slug: "particuliers",
		title: "Adressez-nous vos questions sur l'autisme et les TND",
		module: "contact-particuliers",
		content: legalsContent.contactParticuliers,
		description:
			"Adressez vos questions sur l'autisme et ses troubles associés à la Maison de l'autisme.",
	},
	{
		slug: "professionnels",
		title: "Formulaire de contact réservé aux professionnels des CRA",
		module: "contact-pros-cra",
		content: legalsContent.contactProsCra,
		description:
			"Formulaire de contact dédié aux professionnels des Centres Ressources Autisme (CRA).",
	},
] as const;

export default async function contactTask(payload: BasePayload) {
	const section = await payload.create({
		collection: "page-sections",
		data: { title: "Contact", slug: "contact" },
	});

	for (const { description, ...page } of contactPages) {
		await payload.create({
			collection: "pages",
			data: {
				...page,
				section: section.id,
				showDates: false,
				meta: { description },
				_status: "published",
			},
		});
	}

	payload.logger.info("Contact content seeded successfully");
}
