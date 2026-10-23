// Valeurs du champ « Format » de la collection « Formations ».
// Partagées entre la config Payload et le front (badges, filtres). Les valeurs
// sont des slugs : elles servent telles quelles dans l'URL de recherche.

export const COURSE_FORMATS = [
	{ label: "Présentiel", value: "pres" },
	{ label: "Distanciel", value: "dist" },
] as const;

export type CourseFormat = (typeof COURSE_FORMATS)[number]["value"];

export const courseFormatLabel = (value: string | null | undefined) =>
	COURSE_FORMATS.find((format) => format.value === value)?.label;
