import { z } from "zod";
import { honeypotSchema, INVALID_MESSAGE_REGEX } from "~/utils/contactForm";

export const PROFILE_VALUES = ["pro-cra"] as const;
export type Profile = (typeof PROFILE_VALUES)[number];

export const PROFILE_LABELS: Record<Profile, string> = {
	"pro-cra": "Un professionnel de CRA",
};

export const WISH_VALUES = ["newsletter", "propose-content", "other"] as const;
export type Wish = (typeof WISH_VALUES)[number];

export const WISH_LABELS: Record<Wish, string> = {
	newsletter: "Vous inscrire à la newsletter (pour les pros des CRA)",
	"propose-content": "Proposer un contenu",
	other: 'Autre (précisez dans le champ "Votre message")',
};

export const contactProsCraSchema = z.object({
	profile: z.enum(PROFILE_VALUES, {
		errorMap: () => ({ message: "Veuillez sélectionner votre profil." }),
	}),
	firstName: z.string().trim().min(1, "Veuillez renseigner votre prénom."),
	lastName: z
		.string()
		.trim()
		.min(1, "Veuillez renseigner votre nom de famille."),
	craName: z.string().trim().min(1, "Veuillez renseigner le nom de votre CRA."),
	craRole: z
		.string()
		.trim()
		.min(1, "Veuillez renseigner votre fonction au sein du CRA."),
	wish: z.enum(WISH_VALUES, {
		errorMap: () => ({ message: "Veuillez sélectionner une option." }),
	}),
	message: z
		.string()
		.trim()
		.min(15, "Votre message doit comporter au moins 15 caractères.")
		.max(1000, "Votre message ne doit pas dépasser 1000 caractères.")
		.refine((val) => !INVALID_MESSAGE_REGEX.test(val), {
			message: "Votre message contient des caractères spéciaux non autorisés.",
		}),
	phone: z
		.string()
		.trim()
		.optional()
		.refine((val) => !val || /^\d{10}$/.test(val), {
			message:
				"Le numéro doit être composé de 10 chiffres sans espace ni caractère spécial.",
		}),
	email: z
		.string()
		.trim()
		.min(1, "Veuillez renseigner votre email professionnel.")
		.email("Veuillez renseigner une adresse email valide."),
	website: honeypotSchema,
});

export type ContactProsCraInput = z.infer<typeof contactProsCraSchema>;
