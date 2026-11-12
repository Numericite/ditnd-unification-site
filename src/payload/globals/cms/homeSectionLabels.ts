export const HOME_SECTION_LABELS = {
	newsCarousel: "Actualités",
	personaTiles: "Persona",
	mostViewedGuides: "Fiches pratiques les plus lues",
	newsletter: "Lettre d'information",
} as const;

export type HomeSectionType = keyof typeof HOME_SECTION_LABELS;

export const HOME_SECTION_TYPES = Object.keys(
	HOME_SECTION_LABELS,
) as HomeSectionType[];
