export const ALL_CONDITIONS_SLUG = "tous-tnd";

export const ALL_CONDITIONS_LABEL = "Tous TND";

export const isAllConditionsSelected = (conditions: string[]) =>
	conditions.includes(ALL_CONDITIONS_SLUG);

export const withoutAllConditions = (conditions: string[]) =>
	conditions.filter((slug) => slug !== ALL_CONDITIONS_SLUG);
