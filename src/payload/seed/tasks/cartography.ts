import type { Payload } from "payload";

// ─── Type commun ──────────────────────────────────────────────────────────────

type MarkerInput = {
	name: string;
	address: string;
	postalCode: string;
	city: string;
	latitude: number;
	longitude: number;
	phone?: string;
	website?: string;
	description?: string;
};

// ─── Catégories ──────────────────────────────────────────────────────────────

const mapCategories = [
	{
		name: "Centre de Ressources Autisme",
		slug: "cra",
		colorVariant: "blue-ecume" as const,
		iconId: "fr-icon-map-pin-2-fill",
		description:
			"Les CRA sont des structures régionales qui proposent un appui aux professionnels et aux familles concernées par les troubles du spectre autistique.",
	},
	{
		name: "Maison Départementale des Personnes Handicapées",
		slug: "mdph",
		colorVariant: "green-emeraude" as const,
		iconId: "fr-icon-map-pin-2-fill",
		description:
			"Les MDPH accompagnent les personnes en situation de handicap dans leurs démarches administratives et l'accès aux droits et aides.",
	},
];

// ─── Marqueurs CRA ────────────────────────────────────────────────────────────

const craMarkers: MarkerInput[] = [
	{
		name: "CRA Île-de-France",
		address: "48 boulevard Sérurier",
		postalCode: "75019",
		city: "Paris",
		latitude: 48.8765,
		longitude: 2.3866,
		phone: "01 40 03 22 85",
		website: "https://www.craif.org",
		description:
			"Centre de Ressources Autisme Île-de-France, situé à l'Hôpital Robert Debré.",
	},
	{
		name: "CRA Paris 9ème",
		address: "6 rue La Bruyère",
		postalCode: "75009",
		city: "Paris",
		latitude: 48.877,
		longitude: 2.3347,
		phone: "01 44 53 30 00",
		description: "Antenne parisienne de proximité du réseau CRA Île-de-France.",
	},
	{
		name: "CRA Bretagne",
		address: "2 rue Henri le Guilloux",
		postalCode: "35033",
		city: "Rennes",
		latitude: 48.1085,
		longitude: -1.6777,
		phone: "02 99 26 35 36",
		website: "https://www.cra-bretagne.fr",
		description:
			"Centre de Ressources Autisme Bretagne, rattaché au CHU de Rennes.",
	},
	{
		name: "CRA Normandie",
		address: "1 rue de Germont",
		postalCode: "76031",
		city: "Rouen",
		latitude: 49.4432,
		longitude: 1.0993,
		phone: "02 32 88 87 26",
		description:
			"Centre de Ressources Autisme Normandie, basé au CHU de Rouen.",
	},
	{
		name: "CRA Pays de la Loire",
		address: "1 place Alexis-Ricordeau",
		postalCode: "44093",
		city: "Nantes",
		latitude: 47.2078,
		longitude: -1.5466,
		phone: "02 40 08 40 00",
		website: "https://www.cra-paysdelaloire.fr",
		description:
			"Centre de Ressources Autisme Pays de la Loire, au CHU de Nantes.",
	},
	{
		name: "CRA Provence-Alpes-Côte d'Azur",
		address: "264 rue Saint-Pierre",
		postalCode: "13385",
		city: "Marseille",
		latitude: 43.2905,
		longitude: 5.4028,
		phone: "04 91 74 40 80",
		website: "https://www.cra-paca.fr",
		description:
			"Centre de Ressources Autisme PACA, situé à l'Hôpital de la Timone.",
	},
	{
		name: "CRA Occitanie",
		address: "1 place Lange",
		postalCode: "31059",
		city: "Toulouse",
		latitude: 43.5983,
		longitude: 1.4397,
		phone: "05 62 26 01 70",
		website: "https://www.cra-occitanie.fr",
		description:
			"Centre de Ressources Autisme Occitanie, au sein de l'Hôpital La Grave.",
	},
	{
		name: "CRA Nouvelle-Aquitaine",
		address: "1 rue Jean Burguet",
		postalCode: "33076",
		city: "Bordeaux",
		latitude: 44.8433,
		longitude: -0.5838,
		phone: "05 56 56 20 49",
		website: "https://www.cra-aquitaine.fr",
		description:
			"Centre de Ressources Autisme Nouvelle-Aquitaine, au CHU de Bordeaux.",
	},
	{
		name: "CRA Auvergne-Rhône-Alpes",
		address: "59 boulevard Pinel",
		postalCode: "69677",
		city: "Bron",
		latitude: 45.7408,
		longitude: 4.8939,
		phone: "04 37 91 54 04",
		website: "https://www.cra-ra.org",
		description:
			"Centre de Ressources Autisme Auvergne-Rhône-Alpes, au Centre Hospitalier Le Vinatier.",
	},
	{
		name: "CRA Hauts-de-France",
		address: "2 avenue Oscar Lambret",
		postalCode: "59037",
		city: "Lille",
		latitude: 50.6104,
		longitude: 3.0347,
		phone: "03 20 44 57 94",
		website: "https://www.cra-hdf.fr",
		description:
			"Centre de Ressources Autisme Hauts-de-France, au CHU de Lille.",
	},
	{
		name: "CRA Grand Est",
		address: "1 place de l'Hôpital",
		postalCode: "67091",
		city: "Strasbourg",
		latitude: 48.5824,
		longitude: 7.7532,
		phone: "03 88 11 68 56",
		description:
			"Centre de Ressources Autisme Grand Est, aux Hôpitaux Universitaires de Strasbourg.",
	},
];

// ─── Marqueurs MDPH ───────────────────────────────────────────────────────────

const mdphMarkers: MarkerInput[] = [
	{
		name: "MDPH Paris (75)",
		address: "69 rue de Miromesnil",
		postalCode: "75008",
		city: "Paris",
		latitude: 48.8758,
		longitude: 2.3136,
		phone: "01 53 43 15 00",
		website: "https://www.mdph.paris.fr",
		description: "Maison Départementale des Personnes Handicapées de Paris.",
	},
	{
		name: "MDPH Gironde (33)",
		address: "89 rue Paulin",
		postalCode: "33081",
		city: "Bordeaux",
		latitude: 44.8404,
		longitude: -0.5842,
		phone: "05 56 99 66 66",
		website: "https://www.mdph33.fr",
		description:
			"Maison Départementale des Personnes Handicapées de la Gironde.",
	},
	{
		name: "MDPH Bouches-du-Rhône (13)",
		address: "128 avenue du Prado",
		postalCode: "13008",
		city: "Marseille",
		latitude: 43.2648,
		longitude: 5.3936,
		phone: "04 13 31 50 00",
		website: "https://www.mdph13.fr",
		description:
			"Maison Départementale des Personnes Handicapées des Bouches-du-Rhône.",
	},
	{
		name: "MDPH Rhône (69)",
		address: "23 rue du Président Carnot",
		postalCode: "69002",
		city: "Lyon",
		latitude: 45.747,
		longitude: 4.83,
		phone: "04 72 00 26 26",
		website: "https://www.mdph69.fr",
		description: "Maison Départementale des Personnes Handicapées du Rhône.",
	},
	{
		name: "MDPH Nord (59)",
		address: "123 bis rue Solférino",
		postalCode: "59000",
		city: "Lille",
		latitude: 50.6261,
		longitude: 3.0685,
		phone: "03 59 73 89 89",
		website: "https://www.mdph59.fr",
		description: "Maison Départementale des Personnes Handicapées du Nord.",
	},
	{
		name: "MDPH Haute-Garonne (31)",
		address: "6 rue René Leduc",
		postalCode: "31069",
		city: "Toulouse",
		latitude: 43.6047,
		longitude: 1.4442,
		phone: "05 34 41 62 62",
		website: "https://www.mdph31.fr",
		description:
			"Maison Départementale des Personnes Handicapées de la Haute-Garonne.",
	},
	{
		name: "MDPH Ille-et-Vilaine (35)",
		address: "1 avenue de la Préfecture",
		postalCode: "35000",
		city: "Rennes",
		latitude: 48.1113,
		longitude: -1.68,
		phone: "02 99 02 26 26",
		website: "https://www.mdph35.fr",
		description:
			"Maison Départementale des Personnes Handicapées d'Ille-et-Vilaine.",
	},
	{
		name: "MDPH Bas-Rhin (67)",
		address: "8 rue de Mutzig",
		postalCode: "67000",
		city: "Strasbourg",
		latitude: 48.574,
		longitude: 7.7526,
		phone: "03 88 56 20 20",
		website: "https://www.mdph67.fr",
		description: "Maison Départementale des Personnes Handicapées du Bas-Rhin.",
	},
	{
		name: "MDPH Loire-Atlantique (44)",
		address: "8 route de la Jonelière",
		postalCode: "44306",
		city: "Nantes",
		latitude: 47.2491,
		longitude: -1.552,
		phone: "02 51 84 54 00",
		website: "https://www.mdph44.fr",
		description:
			"Maison Départementale des Personnes Handicapées de Loire-Atlantique.",
	},
	{
		name: "MDPH Hérault (34)",
		address: "583 rue Croix-Verte",
		postalCode: "34090",
		city: "Montpellier",
		latitude: 43.5937,
		longitude: 3.8569,
		phone: "04 67 67 70 00",
		website: "https://www.mdph34.fr",
		description:
			"Maison Départementale des Personnes Handicapées de l'Hérault.",
	},
	{
		name: "MDPH Alpes-Maritimes (06)",
		address: "147 boulevard du Mercantour",
		postalCode: "06200",
		city: "Nice",
		latitude: 43.7102,
		longitude: 7.262,
		phone: "04 89 04 14 14",
		website: "https://www.mdph06.fr",
		description:
			"Maison Départementale des Personnes Handicapées des Alpes-Maritimes.",
	},
	{
		name: "MDPH Seine-Maritime (76)",
		address: "19 rue des Arsins",
		postalCode: "76100",
		city: "Rouen",
		latitude: 49.4309,
		longitude: 1.0969,
		phone: "02 35 03 56 00",
		website: "https://www.mdph76.fr",
		description:
			"Maison Départementale des Personnes Handicapées de la Seine-Maritime.",
	},
];

// ─── Carte ────────────────────────────────────────────────────────────────────

const mapData = {
	name: "Carte des structures",
	slug: "carte-des-structures",
	title: "Structures d'accompagnement en France",
	description:
		"Retrouvez les Centres de Ressources Autisme (CRA) et les Maisons Départementales des Personnes Handicapées (MDPH) sur le territoire français.",
	defaultLatitude: 46.6,
	defaultLongitude: 2.3,
	defaultZoom: 5,
	fitToMarkers: true,
};

// ─── Fonctions de création ────────────────────────────────────────────────────

async function createMapCategory(
	payload: Payload,
	data: (typeof mapCategories)[number],
): Promise<number> {
	try {
		const category = await payload.create({
			collection: "map-categories",
			data,
		});
		return category.id;
	} catch (error) {
		throw new Error(
			`Erreur lors de la création de la catégorie "${data.name}" : ${error}`,
		);
	}
}

async function createMapMarker(
	payload: Payload,
	data: MarkerInput,
	categoryId: number,
): Promise<void> {
	try {
		await payload.create({
			collection: "map-markers",
			data: {
				...data,
				category: categoryId,
			},
		});
	} catch (error) {
		throw new Error(
			`Erreur lors de la création du marqueur "${data.name}" : ${error}`,
		);
	}
}

async function createMap(
	payload: Payload,
	data: typeof mapData,
	categoryIds: number[],
): Promise<void> {
	try {
		await payload.create({
			collection: "maps",
			data: {
				...data,
				categories: categoryIds,
			},
		});
	} catch (error) {
		throw new Error(
			`Erreur lors de la création de la carte "${data.name}" : ${error}`,
		);
	}
}

// ─── Export ────────────────────────────────────────────────────────────────────

export async function seedCartography(payload: Payload) {
	// 1. Créer les catégories
	const categoryIds: number[] = [];
	for (const category of mapCategories) {
		const id = await createMapCategory(payload, category);
		categoryIds.push(id);
	}

	const [craCategoryId, mdphCategoryId] = categoryIds;

	// 2. Créer les marqueurs CRA
	if (craCategoryId === undefined) {
		throw new Error(
			"Impossible de créer les marqueurs CRA : catégorie introuvable.",
		);
	}
	for (const marker of craMarkers) {
		await createMapMarker(payload, marker, craCategoryId);
	}

	// 3. Créer les marqueurs MDPH
	if (mdphCategoryId === undefined) {
		throw new Error(
			"Impossible de créer les marqueurs MDPH : catégorie introuvable.",
		);
	}
	for (const marker of mdphMarkers) {
		await createMapMarker(payload, marker, mdphCategoryId);
	}

	// 4. Créer la carte (avec les deux catégories)
	await createMap(payload, mapData, categoryIds);
}
