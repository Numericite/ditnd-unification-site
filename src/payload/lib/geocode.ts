const BAN_ENDPOINT = "https://api-adresse.data.gouv.fr/search/";

export async function geocodeAddress(
	address?: string | null,
	postalCode?: string | null,
	city?: string | null,
): Promise<{ latitude: number; longitude: number } | null> {
	const query = [address, postalCode, city]
		.filter((part): part is string => Boolean(part?.trim()))
		.map((p) => p.trim())
		.join(" ")
		.trim();

	if (!query) return null;

	try {
		const url = `${BAN_ENDPOINT}?q=${encodeURIComponent(query)}&limit=1`;
		const response = await fetch(url, {
			headers: { Accept: "application/json" },
		});
		if (!response.ok) {
			console.warn(`[geocode] BAN HTTP ${response.status} for "${query}"`);
			return null;
		}
		const json = (await response.json()) as {
			features?: Array<{ geometry?: { coordinates?: [number, number] } }>;
		};
		const coords = json.features?.[0]?.geometry?.coordinates;
		if (!coords || coords.length !== 2) return null;
		const [longitude, latitude] = coords;
		return { latitude, longitude };
	} catch (err) {
		console.warn(`[geocode] BAN failed for "${query}":`, err);
		return null;
	}
}
