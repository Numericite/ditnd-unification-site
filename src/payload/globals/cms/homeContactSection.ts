import type { Field, TextFieldSingleValidation } from "payload";
import { date as validateDate } from "payload/shared";
import { validateHttpUrl } from "~/payload/fields/validateHttpUrl";
import { toMinutes } from "~/utils/scheduleTime";

type TimeSlot = { openTime?: string | null; closeTime?: string | null };

// Other slots of the day come from the whole document: a slot's validation
// only receives its own row as siblingData
const daySlots = (
	data: unknown,
	path: (number | string)[],
): TimeSlot[] | undefined => {
	const slots = path
		.slice(0, -2)
		.reduce<unknown>(
			(node, key) =>
				node && typeof node === "object"
					? (node as Record<string | number, unknown>)[key]
					: undefined,
			data,
		);
	return Array.isArray(slots) ? slots : undefined;
};

const timePicker = {
	width: "50%",
	date: {
		pickerAppearance: "timeOnly",
		displayFormat: "HH:mm",
		timeFormat: "HH:mm",
		timeIntervals: 15,
	},
} as const;

const slotsField: Field = {
	name: "slots",
	type: "array",
	label: "Plages horaires",
	labels: {
		singular: "une plage",
		plural: "plages",
	},
	admin: {
		initCollapsed: true,
		components: { RowLabel: "../payload/components/TimeSlotRowLabel" },
		condition: (_data, siblingData) => !siblingData?.closed,
		description:
			"Sans plage, le jour s'affiche « – » et le statut de la ligne est masqué.",
	},
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "openTime",
					type: "date",
					label: "Heure d'ouverture",
					validate: (value, args) => {
						if (!value) return "Ce champ est obligatoire.";
						// Only earlier rows are checked so an overlap is reported once
						const index = Number(args.path.at(-2));
						const open = toMinutes(value);
						const close = toMinutes((args.siblingData as TimeSlot).closeTime);
						const overlaps =
							open !== null &&
							close !== null &&
							(daySlots(args.data, args.path) ?? [])
								.slice(0, index)
								.some((other) => {
									const otherOpen = toMinutes(other.openTime);
									const otherClose = toMinutes(other.closeTime);
									return (
										otherOpen !== null &&
										otherClose !== null &&
										open < otherClose &&
										otherOpen < close
									);
								});
						return overlaps
							? "Cette plage chevauche une autre plage du même jour."
							: validateDate(value, args);
					},
					admin: timePicker,
				},
				{
					name: "closeTime",
					type: "date",
					label: "Heure de fermeture",
					validate: (value, args) => {
						if (!value) return "Ce champ est obligatoire.";
						// Compare times of day only: the picker may store different dates
						const close = toMinutes(value);
						const open = toMinutes((args.siblingData as TimeSlot).openTime);
						if (close !== null && open !== null && close <= open)
							return "L'heure de fermeture doit être après l'heure d'ouverture.";
						return validateDate(value, args);
					},
					admin: timePicker,
				},
			],
		},
	],
};

const dayGroup = (name: string, label: string): Field => ({
	name,
	type: "group",
	label,
	fields: [
		{
			name: "closed",
			type: "checkbox",
			label: "Fermé",
			defaultValue: false,
		},
		slotsField,
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
	label,
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "title",
					type: "text",
					label: "Titre de la tuile",
					defaultValue: defaults.title,
					admin: { width: "40%" },
				},
				{
					name: "description",
					type: "text",
					label: "Description",
					admin: { width: "60%" },
				},
			],
		},
		{
			type: "row",
			fields: [
				{
					name: "buttonLabel",
					type: "text",
					label: "Texte du bouton",
					defaultValue: defaults.buttonLabel,
					admin: { width: "40%" },
				},
				{
					name: "url",
					type: "text",
					label: "URL",
					defaultValue: defaults.url,
					validate: validateUrl,
					admin: { width: "60%" },
				},
			],
		},
	],
});

export const contactSectionFields: Field[] = [
	{
		name: "phone",
		type: "group",
		label: "Téléphone",
		fields: [
			{
				name: "title",
				type: "text",
				label: "Titre de la tuile",
				defaultValue: "Par téléphone",
			},
			{
				name: "number",
				type: "text",
				label: "Numéro",
				required: true,
				defaultValue: "0 800 71 40 40",
			},
			{
				name: "label",
				type: "text",
				label: "Sous-titre",
				admin: { description: "Ex : Service et appel gratuits" },
			},
			{
				name: "scheduleNote",
				type: "text",
				label: "Note dans le popover horaires",
				admin: {
					description: "Ex : Appel gratuit depuis un fixe ou un mobile.",
				},
			},
			{
				name: "schedule",
				type: "group",
				label: "Horaires",
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
];
