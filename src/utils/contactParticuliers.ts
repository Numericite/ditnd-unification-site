import { z } from "zod";
import { honeypotSchema, INVALID_MESSAGE_REGEX } from "~/utils/contactForm";

export const CIVILITY_VALUES = ["Madame", "Monsieur"] as const;
export type Civility = (typeof CIVILITY_VALUES)[number];

export const SEXE_VALUES = ["Féminin", "Masculin"] as const;
export type Sexe = (typeof SEXE_VALUES)[number];

export const AGE_RANGE_VALUES = [
	"De 0 à 3 ans",
	"De 4 à 12 ans",
	"De 13 à 18 ans",
	"De 18 à 25 ans",
	"De 26 à 50 ans",
	"Plus de 50 ans",
] as const;
export type AgeRange = (typeof AGE_RANGE_VALUES)[number];

export const OBJET_VALUES = [
	"Diagnostic",
	"Santé",
	"Social",
	"Éducation",
	"Accompagnement",
	"Droit",
	"Autre",
] as const;
export type Objet = (typeof OBJET_VALUES)[number];

export const CLASSIFICATION_VALUES = [
	"Usager concerné",
	"Parent d’un enfant concerné",
	"Proche d'une personne concernée",
	"Professionnel de santé",
	"Professionnel encadrant",
	"Enseignant",
	"Membre associatif",
	"Journaliste",
	"Partenaire",
	"Autre",
] as const;
export type Classification = (typeof CLASSIFICATION_VALUES)[number];

export const DEPARTEMENT_VALUES = [
	"01 - Ain",
	"02 - Aisne",
	"03 - Allier",
	"04 - Alpes-de-Haute-Provence",
	"05 - Hautes-Alpes",
	"06 - Alpes-Maritimes",
	"07 - Ardèche",
	"08 - Ardennes",
	"09 - Ariège",
	"10 - Aube",
	"11 - Aude",
	"12 - Aveyron",
	"13 - Bouches-du-Rhône",
	"14 - Calvados",
	"15 - Cantal",
	"16 - Charente",
	"17 - Charente-Maritime",
	"18 - Cher",
	"19 - Corrèze",
	"20 - Corse",
	"21 - Côte-d'Or",
	"22 - Côtes-d'Armor",
	"23 - Creuse",
	"24 - Dordogne",
	"25 - Doubs",
	"26 - Drôme",
	"27 - Eure",
	"28 - Eure-et-Loir",
	"29 - Finistère",
	"30 - Gard",
	"31 - Haute-Garonne",
	"32 - Gers",
	"33 - Gironde",
	"34 - Hérault",
	"35 - Ille-et-Vilaine",
	"36 - Indre",
	"37 - Indre-et-Loire",
	"38 - Isère",
	"39 - Jura",
	"40 - Landes",
	"41 - Loir-et-Cher",
	"42 - Loire",
	"43 - Haute-Loire",
	"44 - Loire-Atlantique",
	"45 - Loiret",
	"46 - Lot",
	"47 - Lot-et-Garonne",
	"48 - Lozère",
	"49 - Maine-et-Loire",
	"50 - Manche",
	"51 - Marne",
	"52 - Haute-Marne",
	"53 - Mayenne",
	"54 - Meurthe-et-Moselle",
	"55 - Meuse",
	"56 - Morbihan",
	"57 - Moselle",
	"58 - Nièvre",
	"59 - Nord",
	"60 - Oise",
	"61 - Orne",
	"62 - Pas-de-Calais",
	"63 - Puy-de-Dôme",
	"64 - Pyrenées-Atlantiques",
	"65 - Hautes-Pyrenées",
	"66 - Pyrenées-Orientales",
	"67 - Bas-Rhin",
	"68 - Haut-Rhin",
	"69 - Rhône",
	"70 - Haute-Saône",
	"71 - Saône-et-Loire",
	"72 - Sarthe",
	"73 - Savoie",
	"74 - Haute-Savoie",
	"75 - Paris",
	"76 - Seine-Maritime",
	"77 - Seine-et-Marne",
	"78 - Yvelines",
	"79 - Deux-Sèvres",
	"80 - Somme",
	"81 - Tarn",
	"82 - Tarn-et-Garonne",
	"83 - Var",
	"84 - Vaucluse",
	"85 - Vendée",
	"86 - Vienne",
	"87 - Haute-Vienne",
	"88 - Vosges",
	"89 - Yonne",
	"90 - Territoire de Belfort",
	"91 - Essonne",
	"92 - Hauts-de-Seine",
	"93 - Seine-Saint-Denis",
	"94 - Val-de-Marne",
	"95 - Val-d'Oise",
	"971 - Guadeloupe",
	"972 - Martinique",
	"973 - Guyane",
	"974 - La Réunion",
	"975 - Mayotte",
] as const;

export const contactParticuliersSchema = z.object({
	civility: z.enum(CIVILITY_VALUES).optional(),
	lastName: z.string().trim().min(1, "Veuillez renseigner votre nom.").max(255),
	firstName: z
		.string()
		.trim()
		.min(1, "Veuillez renseigner votre prénom.")
		.max(255),
	email: z
		.string()
		.trim()
		.min(1, "Veuillez renseigner votre courriel.")
		.email("Veuillez renseigner une adresse email valide.")
		.max(254),
	departement: z.string().trim().max(255).optional(),
	objet: z.enum(OBJET_VALUES, {
		errorMap: () => ({
			message: "Veuillez sélectionner l'objet de votre demande.",
		}),
	}),
	classification: z.enum(CLASSIFICATION_VALUES, {
		errorMap: () => ({ message: "Veuillez sélectionner une option." }),
	}),
	sexe: z.enum(SEXE_VALUES).optional(),
	ageRange: z.enum(AGE_RANGE_VALUES).optional(),
	message: z
		.string()
		.trim()
		.min(15, "Votre message doit comporter au moins 15 caractères.")
		.max(2000, "Votre message ne doit pas dépasser 2000 caractères.")
		.refine((val) => !INVALID_MESSAGE_REGEX.test(val), {
			message: "Votre message contient des caractères spéciaux non autorisés.",
		}),
	newsletter: z.boolean().optional(),
	consent: z.literal(true, {
		errorMap: () => ({
			message: "Vous devez accepter pour soumettre le formulaire.",
		}),
	}),
	website: honeypotSchema,
});

export type ContactParticuliersInput = z.infer<
	typeof contactParticuliersSchema
>;
