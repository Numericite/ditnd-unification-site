import { z } from "zod";
import { honeypotSchema } from "~/utils/contactForm";

export const newsletterSubscribeSchema = z.object({
	email: z
		.string()
		.min(1, "Veuillez renseigner votre adresse électronique")
		.email("Format adresse courriel attendu. Exemple : nom@domaine.fr"),
	website: honeypotSchema,
});

export type NewsletterSubscribeInput = z.infer<
	typeof newsletterSubscribeSchema
>;
