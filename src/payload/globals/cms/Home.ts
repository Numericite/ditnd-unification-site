import type { Field, GlobalConfig, TextFieldSingleValidation } from "payload";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";
import { standardFields } from "~/payload/fields/standards";
import { validateHttpUrl } from "~/payload/fields/validateHttpUrl";
import { date as validateDate } from "payload/shared";
import type { Home } from "~/payload/payload-types";
import { toMinutes } from "~/utils/scheduleTime";

type DaySchedule = NonNullable<
	NonNullable<Home["contact"]["phone"]["schedule"]>["lundi"]
>;
type TimeKey = "openTime" | "closeTime";

const timeField = (
	name: TimeKey,
	label: string,
	// Sibling time this one must be strictly later than (e.g. closing > opening)
	after?: TimeKey,
): Field => ({
	name,
	type: "date",
	label: { fr: label },
	validate: (value, args) => {
		// Payload types siblingData as unknown: these fields live in a day group
		const siblings = (args.siblingData ?? {}) as Partial<DaySchedule>;
		if (siblings.closed) return validateDate(value, args);
		if (!value) return "Obligatoire pour un jour ouvert.";
		if (after) {
			// Compare times of day only: the picker may store different dates
			const minutes = toMinutes(value);
			const afterMinutes = toMinutes(siblings[after]);
			if (minutes !== null && afterMinutes !== null && minutes <= afterMinutes)
				return "L'heure de fermeture doit être après l'heure d'ouverture.";
		}
		return validateDate(value, args);
	},
	admin: {
		width: "40%",
		condition: (_data, siblingData) => !siblingData?.closed,
		date: {
			pickerAppearance: "timeOnly",
			displayFormat: "HH:mm",
			timeFormat: "HH:mm",
			timeIntervals: 15,
		},
	},
});

const dayGroup = (name: string, label: string): Field => ({
	name,
	type: "group",
	label: { fr: label },
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "closed",
					type: "checkbox",
					label: { fr: "Fermé" },
					defaultValue: false,
					admin: {
						width: "20%",
						style: { alignSelf: "center" },
					},
				},
				timeField("openTime", "Heure d'ouverture"),
				timeField("closeTime", "Heure de fermeture", "openTime"),
			],
		},
	],
});

const linkTileGroup = (
	name: string,
	label: string,
	defaults: { title: string; buttonLabel: string; url?: string },
	validateUrl?: TextFieldSingleValidation,
): Field => ({
	name,
	type: "group",
	label: { fr: label },
	fields: [
		{
			name: "title",
			type: "text",
			label: { fr: "Titre de la tuile" },
			defaultValue: defaults.title,
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
			defaultValue: defaults.buttonLabel,
		},
		{
			name: "url",
			type: "text",
			label: { fr: "URL" },
			defaultValue: defaults.url,
			validate: validateUrl,
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
									defaultValue: "0 800 71 40 40",
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
						linkTileGroup("contactForm", "Formulaire de contact", {
							title: "Par écrit",
							buttonLabel: "Écrire au service",
						}),
						linkTileGroup(
							"directory",
							"Annuaire",
							{
								title: "Annuaire",
								buttonLabel: "Consulter l'annuaire",
								url: "https://annuaire.autismeinfoservice.fr/",
							},
							validateHttpUrl,
						),
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
