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
	email?: string;
	website?: string;
	description?: string;
	metadata?: Record<string, unknown>;
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
		customFields: [
			{
				label: "Pôle Adulte",
				key: "pole-adulte",
				type: "checkbox" as const,
			},
		],
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
		name: "CRA Alsace",
		address:
			"Centre Hospitalier de Rouffach - 27 rue du 4ème RSM - Pavillon 21",
		postalCode: "68250",
		city: "Rouffach",
		latitude: 47.950406,
		longitude: 7.2907,
		phone: "03 89 78 79 64",
		email: "secretariat68@cra-alsace.fr",
		website: "https://cra-alsace.fr/",
		description: "Centre de Ressources Autisme de Grand Est.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Aquitaine",
		address: "Hôpital Charles Perrens - 146 bis rue Léo Saignat",
		postalCode: "33000",
		city: "Bordeaux",
		latitude: 44.827182,
		longitude: -0.594896,
		phone: "05 33 57 80 49",
		email: "poleadoscra-aquitaine@ch-perrens.fr",
		website: "https://cra.ch-perrens.fr/",
		description: "Centre de Ressources Autisme de Nouvelle-Aquitaine.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Auvergne",
		address: "CHU Gabriel Mont pied Pôle de Psychiatrie - 58 rue Montalembert",
		postalCode: "63000",
		city: "Clermont-Ferrand",
		latitude: 45.756911,
		longitude: 3.094373,
		phone: "04 73 75 19 48",
		email: "cra-auvergne@chu-clermontferrand.fr",
		website:
			"https://www.chu-clermontferrand.fr/liste-services/le-cra-en-auvergne",
		description: "Centre de Ressources Autisme d'Auvergne-Rhône-Alpes.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Bourgogne",
		address: "Le Clos des Présidents - 19-21 rue René Coty",
		postalCode: "21001",
		city: "Dijon",
		latitude: 47.298044,
		longitude: 5.067067,
		phone: "03 80 29 54 19",
		email: "cra@crabourgogne.org",
		website: "https://www.crabourgogne.org/",
		description: "Centre de Ressources Autisme de Bourgogne-Franche-Comté.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Bretagne",
		address: "Unité d'Appui et de Coordination - 3 rue Edouard Belin",
		postalCode: "29200",
		city: "Brest",
		latitude: 48.417537,
		longitude: -4.460435,
		phone: "02 98 85 58 90",
		email: "contact@cra.bzh",
		website: "https://www.cra.bzh/",
		description: "Centre de Ressources Autisme de Bretagne.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Champagne-Ardenne - Mission diagnostic et évaluation",
		address: "Clinique de Champagne - 1 rue de l’Université",
		postalCode: "51100",
		city: "Reims",
		latitude: 49.253206,
		longitude: 4.036421,
		phone: "03 26 78 39 67",
		email: "accueil@cra-champagne-ardenne.fr",
		website: "https://www.cra-champagne-ardenne.fr/",
		description: "Centre de Ressources Autisme de Grand Est.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Corsica",
		address: "Immeuble Pingouin - Parc Azur - Bât C Av. Maréchal Juin",
		postalCode: "20000",
		city: "Ajaccio",
		latitude: 41.938421,
		longitude: 8.750711,
		phone: "04 95 50 50 40",
		email: "craajaccio@pep2b.corsica",
		website: "https://pep2b.corsica/cra-corsica/",
		description: "Centre de Ressources Autisme de Corse.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Franche Comté",
		address: "3 rue Victor SELLIER",
		postalCode: "25000",
		city: "Besançon",
		latitude: 47.240278,
		longitude: 5.987853,
		phone: "03 81 21 82 44",
		email: "crafc@chu-besancon.fr",
		website: "https://www.cra-franchecomte.fr/",
		description: "Centre de Ressources Autisme de Bourgogne-Franche-Comté.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Guadeloupe",
		address: "31 lotissement les Jardins de Moudong - 39 B Immeuble Névada",
		postalCode: "97122",
		city: "Baie-Mahault",
		latitude: 16.26119,
		longitude: -61.622748,
		phone: "05 90 25 23 90",
		description: "Centre de Ressources Autisme de Guadeloupe.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Guyane",
		address:
			"10 rue des Galaxy - Bâtiment M - Structure du Centre Hospitalier de Cayenne",
		postalCode: "97300",
		city: "Cayenne",
		latitude: 4.923824,
		longitude: -52.313021,
		phone: "05 94 29 84 24",
		email: "cr.autisme@ch-cayenne.fr",
		website: "https://www.ght-guyane.fr/chc/enseignements/8",
		description: "Centre de Ressources Autisme de Guyane.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Île-de-France",
		address: "10 rue Waldeck-Rochet - Bâtiment 521",
		postalCode: "93300",
		city: "Aubervilliers",
		latitude: 48.910874,
		longitude: 2.367652,
		phone: "01 49 28 54 20",
		email: "contact@craif.org",
		website: "https://craif.org/",
		description: "Centre de Ressources Autisme d'Île-de-France.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Languedoc-Roussillon",
		address:
			"CHRU de Montpellier SMPEA Peyre Plantade - 291 avenue du Doyen Giraud",
		postalCode: "34295",
		city: "Montpellier",
		latitude: 43.633346,
		longitude: 3.850395,
		phone: "04 67 33 99 68",
		website: "https://www.autisme-ressources-lr.fr/",
		description: "Centre de Ressources Autisme d'Occitanie.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Limousin",
		address: "Site de l’Hôpital du Cluzeau - 23 avenue Dominique Larrey",
		postalCode: "87042",
		city: "Limoges",
		latitude: 45.809995,
		longitude: 1.238592,
		phone: "05 55 05 89 84",
		email: "secretariat.cralimousin@chu-limoges.fr",
		website: "https://www.cralimousin.com/",
		description: "Centre de Ressources Autisme de Nouvelle-Aquitaine.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Lorraine",
		address:
			"Centre Psychothérapique de Nancy - 1 rue du Docteur Archambault BP 11010",
		postalCode: "54521",
		city: "Laxou",
		latitude: 48.677975,
		longitude: 6.137205,
		phone: "03 83 92 66 76",
		email: "secretariat.ressourcesautisme@cpn-laxou.com",
		website:
			"https://epsytera.fr/cpn/centre-ressources-autisme-de-lorraine-cra/",
		description: "Centre de Ressources Autisme de Grand Est.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Martinique",
		address:
			"Centre Hospitalier Maurice Despinoy (CHMD) Pôle Intersectoriel - Immeuble ANTARES-PFL Quartier Mangot Vulcin",
		postalCode: "97232",
		city: "Le Lamentin",
		latitude: 14.627957,
		longitude: -60.990444,
		phone: "00 596 596 48 83 60",
		email: "cra-martinique@ch-despinoy.fr",
		website: "https://www.ch-despinoy.fr/",
		description: "Centre de Ressources Autisme de Martinique.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Mayotte",
		address: "6 rue Jardin Fleuri",
		postalCode: "97600",
		city: "Mamoudzou",
		latitude: -12.781756,
		longitude: 45.219735,
		phone: "02 69 61 64 00",
		description: "Centre de Ressources Autisme de Mayotte.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Midi-Pyrénées",
		address: "2 Rue du Lieutenant Guy Dedieu - ZAC de la Cartoucherie",
		postalCode: "31300",
		city: "Toulouse",
		latitude: 43.601486,
		longitude: 1.40497,
		phone: "05 23 61 04 00",
		email: "accueil@cra-mp.info",
		website: "https://www.cra-mp.info/fr/",
		description: "Centre de Ressources Autisme d'Occitanie.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Nord-Pas-De-Calais",
		address: "255 rue Nelson Mandela",
		postalCode: "59120",
		city: "Loos",
		latitude: 50.602192,
		longitude: 3.042332,
		phone: "03 20 60 62 59",
		email: "cra@cra-npdc.fr",
		website: "https://cra-npdc.fr/",
		description: "Centre de Ressources Autisme de Hauts-de-France.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Normandie COM",
		address: "27 rue des Compagnons - CS 30001",
		postalCode: "14033",
		city: "Caen",
		latitude: 49.204399,
		longitude: -0.387612,
		phone: "02 31 06 58 20",
		email: "cra-sec@chu-caen.fr",
		website: "https://cra-normandie-com.fr/",
		description: "Centre de Ressources Autisme de Normandie.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Normandie Seine Eure",
		address: "CH du Rouvray - 4 rue Paul Eluard BP 45",
		postalCode: "76301",
		city: "Sotteville-lès-Rouen",
		latitude: 49.399259,
		longitude: 1.099588,
		phone: "02 32 95 18 64",
		email: "cra@ch-lerouvray.fr",
		website: "http://cra-normandie-seine-eure.fr/",
		description: "Centre de Ressources Autisme de Normandie.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Pays de la Loire",
		address: "Pôle Régional CHU Angers - 4 rue Larrey",
		postalCode: "49933",
		city: "Angers",
		latitude: 47.480948,
		longitude: -0.554426,
		phone: "02 41 35 31 21",
		email: "contact@cra-paysdelaloire.fr",
		website: "https://cra-paysdelaloire.fr/",
		description: "Centre de Ressources Autisme de Pays de la Loire.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Picardie",
		address:
			"CHU Amiens-Picardie - Site Sud – Bât. St Vincent de Paul - 1 Rond-point du Pr Christian Cabrol",
		postalCode: "80054",
		city: "Amiens",
		latitude: 49.876182,
		longitude: 2.255731,
		phone: "03 22 66 75 40",
		email: "CRAdePicardie@chu-amiens.fr",
		website:
			"https://www.chu-amiens.fr/patients-et-visiteurs/services-et-contacts/les-structures-basees-en-ville/le-centre-ressources-autisme-picardie-cra-amiens-picardie/",
		description: "Centre de Ressources Autisme de Hauts-de-France.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Poitou-Charentes",
		address: "CH Henri Laborit - 370 avenue Jacques Cœur CS 10587",
		postalCode: "86021",
		city: "Poitiers",
		latitude: 46.555504,
		longitude: 0.393951,
		phone: "05 49 44 57 59",
		email: "secretariat-cra@ch-poitiers.fr",
		website: "https://www.cra-pc.fr/",
		description: "Centre de Ressources Autisme de Nouvelle-Aquitaine.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Provence-Alpes-Côte d'Azur - Pôle Marseille",
		address:
			"Hôpital Sainte-Marguerite - Service Universitaire de Psychiatrie de l’Enfant et de l’Adolescent du Pr. Poinso - 270 boulevard Sainte-Marguerite",
		postalCode: "13009",
		city: "Marseille",
		latitude: 43.262521,
		longitude: 5.412686,
		phone: "04 91 74 54 39",
		email: "secretariatcrapacaenfants-adolescents@ap-hm.fr",
		website: "https://cra-paca.centredoc.fr/",
		description: "Centre de Ressources Autisme de Provence-Alpes-Côte d’Azur.",
		metadata: { "pole-adulte": false },
	},
	{
		name: "CRA Réunion",
		address: "14 ruelle Rivière",
		postalCode: "97436",
		city: "Saint-Leu La Réunion",
		latitude: -21.169438,
		longitude: 55.289241,
		phone: "02 62 22 59 52",
		email: "secretaire.cra@clairejoie.re",
		website: "https://www.cria.re/index.php",
		description: "Centre de Ressources Autisme de La Réunion.",
		metadata: { "pole-adulte": true },
	},
	{
		name: "CRA Rhône-Alpes",
		address:
			"Centre Hospitalier le Vinatier Bât. 211 - 95 boulevard Pinel BP 30039",
		postalCode: "69678",
		city: "Bron",
		latitude: 45.742052,
		longitude: 4.894137,
		phone: "04 37 91 54 65",
		website: "https://www.cra-rhone-alpes.org/",
		description: "Centre de Ressources Autisme d'Auvergne-Rhône-Alpes.",
		metadata: { "pole-adulte": false },
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
	const { metadata, ...rest } = data;
	const hasCoords =
		typeof data.latitude === "number" && typeof data.longitude === "number";
	try {
		await payload.create({
			collection: "map-markers",
			data: {
				...rest,
				category: categoryId,
				...(metadata !== undefined ? { metadata } : {}),
			},
			context: hasCoords ? { skipGeocode: true } : {},
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
	allowedCustomFieldFilters: Array<{ categoryId: number; key: string }>,
): Promise<void> {
	try {
		await payload.create({
			collection: "maps",
			data: {
				...data,
				categories: categoryIds,
				allowedCustomFieldFilters,
			},
		});
	} catch (error) {
		throw new Error(
			`Erreur lors de la création de la carte "${data.name}" : ${error}`,
		);
	}
}

// ─── Réinitialisation par slug ──────────────────────────────────────────────────

// Supprime uniquement la carte et les catégories gérées par ce seed (par slug),
// ainsi que les marqueurs rattachés à ces catégories. Toute autre carte, catégorie
// ou marqueur créé par ailleurs reste intact.
export async function resetCartography(payload: Payload) {
	await payload.delete({
		collection: "maps",
		where: { slug: { equals: mapData.slug } },
	});

	for (const category of mapCategories) {
		const { docs } = await payload.find({
			collection: "map-categories",
			where: { slug: { equals: category.slug } },
			limit: 1,
		});
		const existing = docs[0];
		if (!existing) continue;

		await payload.delete({
			collection: "map-markers",
			where: { category: { equals: existing.id } },
		});
		await payload.delete({
			collection: "map-categories",
			where: { id: { equals: existing.id } },
		});
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

	// 4. Créer la carte (avec les deux catégories + filtre custom field CRA)
	await createMap(payload, mapData, categoryIds, [
		{ categoryId: craCategoryId, key: "pole-adulte" },
	]);
}
