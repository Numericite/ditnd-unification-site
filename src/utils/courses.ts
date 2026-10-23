// Valeurs des champs « Format » et « Durée » de la collection « Formations ».
// Partagées entre la config Payload et le front (badges, filtres). Les valeurs
// sont des slugs : elles servent telles quelles dans l'URL de recherche.

export const COURSE_FORMATS = [
	{ label: "Présentiel", value: "pres" },
	{ label: "Distanciel", value: "dist" },
] as const;

export type CourseFormat = (typeof COURSE_FORMATS)[number]["value"];

export const COURSE_DURATIONS = [
	{ label: "Inférieur à 1j", value: "lt1j" },
	{ label: "Entre 1 et 3j", value: "1-3j" },
	{ label: "Supérieur à 3j", value: "gt3j" },
] as const;

export type CourseDuration = (typeof COURSE_DURATIONS)[number]["value"];

export const courseFormatLabel = (value: string | null | undefined) =>
	COURSE_FORMATS.find((format) => format.value === value)?.label;

export const courseDurationLabel = (value: string | null | undefined) =>
	COURSE_DURATIONS.find((duration) => duration.value === value)?.label;
