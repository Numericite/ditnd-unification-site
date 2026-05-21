import type { CollectionBeforeChangeHook } from "payload";

const BAN_ENDPOINT = "https://api-adresse.data.gouv.fr/search/";

const buildQuery = (
	address?: string | null,
	postalCode?: string | null,
	city?: string | null,
): string =>
	[address, postalCode, city]
		.filter((part): part is string => Boolean(part?.trim()))
		.map((part) => part.trim())
		.join(" ")
		.trim();

export const geocodeMarker: CollectionBeforeChangeHook = async ({
	data,
	originalDoc,
}) => {
	const query = buildQuery(data.address, data.postalCode, data.city);
	if (!query) return data;

	const previousQuery = buildQuery(
		originalDoc?.address,
		originalDoc?.postalCode,
		originalDoc?.city,
	);
	const addressChanged = query !== previousQuery;
	const hasCoords =
		typeof data.latitude === "number" && typeof data.longitude === "number";

	if (!addressChanged && hasCoords) return data;

	try {
		const url = `${BAN_ENDPOINT}?q=${encodeURIComponent(query)}&limit=1`;
		const response = await fetch(url, {
			headers: { Accept: "application/json" },
		});
		if (!response.ok) {
			console.warn(
				`[MapMarkers] BAN geocoding HTTP ${response.status} for "${query}"`,
			);
			return data;
		}
		const json = (await response.json()) as {
			features?: Array<{ geometry?: { coordinates?: [number, number] } }>;
		};
		const coords = json.features?.[0]?.geometry?.coordinates;
		if (!coords || coords.length !== 2) return data;
		const [longitude, latitude] = coords;
		return { ...data, latitude, longitude };
	} catch (err) {
		console.warn(`[MapMarkers] BAN geocoding failed for "${query}":`, err);
		return data;
	}
};
