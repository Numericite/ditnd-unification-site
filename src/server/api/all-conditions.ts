import type { Payload } from "payload";

const relationId = (value: unknown): number | null => {
	if (typeof value === "number") return value;
	if (typeof value === "object" && value !== null && "id" in value)
		return (value as { id: number }).id;
	return null;
};

/**
 * Ids des documents reliés à l'intégralité des troubles existants — la
 * sémantique de la case « Tous TND ». Payload ne sait pas exprimer « contient
 * tous les éléments de » dans un `where`, d'où ce pré-filtre sur les ids.
 */
export const findDocsWithAllConditions = async (
	payload: Payload,
	collection: "practical-guides" | "courses",
): Promise<number[]> => {
	const conditions = await payload.find({
		collection: "conditions",
		limit: 0,
		depth: 0,
		select: { slug: true },
	});

	const conditionCount = conditions.totalDocs;
	if (!conditionCount) return [];

	const docs = await payload.find({
		collection,
		limit: 0,
		depth: 0,
		select: { conditions: true },
	});

	return docs.docs
		.filter((doc) => {
			const related = (doc as { conditions?: unknown }).conditions;
			if (!Array.isArray(related)) return false;
			const ids = new Set(
				related.map(relationId).filter((id): id is number => id !== null),
			);
			return ids.size === conditionCount;
		})
		.map((doc) => doc.id as number);
};
