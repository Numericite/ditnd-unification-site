import type { BeforeSync } from "@payloadcms/plugin-search/types";
import { lexicalToText } from "~/utils/tools";

/**
 * Resolves relation names from a hasMany relationship field.
 * Handles both populated objects and raw IDs.
 */
async function resolveRelationNames(
	payload: Parameters<BeforeSync>[0]["payload"],
	items: unknown[] | null | undefined,
	collection: string,
	nameField: string,
): Promise<string> {
	if (!items?.length) return "";

	const names = await Promise.all(
		items.map(async (item) => {
			if (typeof item === "object" && item !== null && nameField in item) {
				return (item as Record<string, string>)[nameField];
			}
			if (typeof item === "number" || typeof item === "string") {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const doc = await payload.findByID({
					collection: collection as any,
					id: item as number,
				});
				return (doc as Record<string, string>)[nameField];
			}
			return "";
		}),
	);

	return names.filter(Boolean).join(" ");
}

export const beforeSyncPracticalGuide: BeforeSync = async ({
	originalDoc,
	searchDoc,
	payload,
}) => {
	const doc = originalDoc as Record<string, unknown>;

	const contentText = lexicalToText(doc.content);

	const [conditionNames, themeNames, personaNames] = await Promise.all([
		resolveRelationNames(
			payload,
			doc.conditions as unknown[],
			"conditions",
			"acronym",
		),
		resolveRelationNames(payload, doc.themes as unknown[], "themes", "name"),
		resolveRelationNames(payload, doc.persona as unknown[], "personas", "name"),
	]);

	return {
		...searchDoc,
		title: (doc.title as string) ?? "",
		slug: (doc.slug as string) ?? "",
		description: (doc.description as string) ?? "",
		contentText,
		conditionNames,
		themeNames,
		personaNames,
	};
};
