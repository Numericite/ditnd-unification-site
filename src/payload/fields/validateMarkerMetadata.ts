import type { JSONFieldValidation } from "payload";
import { isValidHttpUrl } from "~/utils/map-link-field";

/**
 * Vérifie les valeurs des champs personnalisés de type "link" à partir des
 * définitions de la catégorie du marqueur : URL http(s) obligatoire dès qu'un
 * libellé ou une URL est saisi.
 */
export const validateMarkerMetadata: JSONFieldValidation = async (
	value,
	{ data, req },
) => {
	if (!value || typeof value !== "object" || Array.isArray(value)) return true;

	const rawCategory = (data as { category?: unknown } | undefined)?.category;
	const categoryId =
		rawCategory && typeof rawCategory === "object"
			? (rawCategory as { id?: unknown }).id
			: rawCategory;
	if (typeof categoryId !== "number" && typeof categoryId !== "string")
		return true;

	const category = await req.payload
		.findByID({
			collection: "map-categories",
			id: categoryId,
			depth: 0,
			req,
		})
		.catch(() => null);
	if (!category) return true;

	const metadata = value as Record<string, unknown>;
	for (const field of category.customFields ?? []) {
		if (field.type !== "link") continue;
		const entry = metadata[field.key];
		if (entry === undefined || entry === null) continue;

		const url =
			typeof entry === "string"
				? entry
				: typeof entry === "object" && !Array.isArray(entry)
					? (entry as { url?: unknown }).url
					: undefined;

		if (typeof url !== "string" || !url.trim()) {
			return `${field.label} : l'URL est obligatoire.`;
		}
		if (!isValidHttpUrl(url.trim())) {
			return `${field.label} : l'URL doit commencer par http:// ou https://`;
		}
	}
	return true;
};
