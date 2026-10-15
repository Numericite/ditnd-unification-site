import type { Field, GlobalConfig } from "payload";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";
import { standardFields } from "~/payload/fields/standards";

const dayGroup = (name: string, label: string): Field => ({
	name,
	type: "group",
	label: { fr: label },
	fields: [
		{
			name: "closed",
			type: "checkbox",
			label: { fr: "Fermé" },
			defaultValue: false,
		},
		{
			name: "openTime",
			type: "text",
			label: { fr: "Heure d'ouverture" },
			admin: {
				placeholder: "9h",
				condition: (_data, siblingData) => !siblingData?.closed,
			},
		},
		{
			name: "closeTime",
			type: "text",
			label: { fr: "Heure de fermeture" },
			admin: {
				placeholder: "18h",
				condition: (_data, siblingData) => !siblingData?.closed,
			},
		},
	],
});

export const CMSHome: GlobalConfig = {
	slug: "home",
	label: "Accueil",
	admin: {
		group: { fr: "Pages" },
		hidden: hideForNonAdmin,
	},
	access: {
		read: isAdmin,
		update: isAdmin,
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "En-tête",
					name: "header",
					fields: [standardFields.title, standardFields.longDescription],
				},
				{
					label: "Contact",
					name: "contact",
					fields: [
						{
							name: "phone",
							type: "group",
							label: { fr: "Téléphone" },
							fields: [
								{
									name: "title",
									type: "text",
									label: { fr: "Titre de la tuile" },
									defaultValue: "Par téléphone",
								},
								{
									name: "number",
									type: "text",
									label: { fr: "Numéro" },
									required: true,
								},
								{
									name: "label",
									type: "text",
									label: { fr: "Sous-titre" },
									admin: { description: "Ex : Service et appel gratuits" },
								},
								{
									name: "scheduleNote",
									type: "text",
									label: { fr: "Note dans le popover horaires" },
									admin: {
										description:
											"Ex : Appel gratuit depuis un fixe ou un mobile.",
									},
								},
								{
									name: "schedule",
									type: "group",
									label: { fr: "Horaires" },
									fields: [
										dayGroup("lundi", "Lundi"),
										dayGroup("mardi", "Mardi"),
										dayGroup("mercredi", "Mercredi"),
										dayGroup("jeudi", "Jeudi"),
										dayGroup("vendredi", "Vendredi"),
										dayGroup("samedi", "Samedi"),
										dayGroup("dimanche", "Dimanche"),
									],
								},
							],
						},
						{
							name: "contactForm",
							type: "group",
							label: { fr: "Formulaire de contact" },
							fields: [
								{
									name: "title",
									type: "text",
									label: { fr: "Titre de la tuile" },
									defaultValue: "Par écrit",
								},
								{
									name: "description",
									type: "textarea",
									label: { fr: "Description" },
								},
								{
									name: "buttonLabel",
									type: "text",
									label: { fr: "Texte du bouton" },
									defaultValue: "Écrire au service",
								},
								{
									name: "url",
									type: "text",
									label: { fr: "URL" },
								},
							],
						},
						{
							name: "directory",
							type: "group",
							label: { fr: "Annuaire" },
							fields: [
								{
									name: "title",
									type: "text",
									label: { fr: "Titre de la tuile" },
									defaultValue: "Annuaire",
								},
								{
									name: "description",
									type: "textarea",
									label: { fr: "Description" },
								},
								{
									name: "buttonLabel",
									type: "text",
									label: { fr: "Texte du bouton" },
									defaultValue: "Consulter l'annuaire",
								},
								{
									name: "url",
									type: "text",
									label: { fr: "URL" },
								},
							],
						},
					],
				},
				{
					label: "Persona",
					name: "tiles",
					fields: [
						{
							name: "persona",
							label: "Choix du profil",
							type: "group",
							fields: [standardFields.title, standardFields.longDescription],
						},
						{
							name: "condition",
							label: "Choix du trouble",
							type: "group",
							fields: [standardFields.title, standardFields.longDescription],
						},
					],
				},
				{
					label: "Fiches pratiques les plus lues",
					name: "mostViewedGuides",
					fields: [standardFields.title, standardFields.longDescription],
				},
			],
		},
	],
};
