import {
	type Classification,
	CONSENT_LABEL,
	type ContactParticuliersInput,
	NEWSLETTER_LABEL,
} from "~/utils/contactParticuliers";

type GravityFormsEntry = Record<string, string | number>;

type GravityFormsConfig = {
	apiUrl: string;
	consumerKey: string;
	consumerSecret: string;
	formId: number;
};

export function getGravityFormsConfig(): GravityFormsConfig | null {
	const apiUrl = process.env.GRAVITY_FORMS_API_URL;
	const consumerKey = process.env.GRAVITY_FORMS_CONSUMER_KEY;
	const consumerSecret = process.env.GRAVITY_FORMS_CONSUMER_SECRET;
	const formId = Number(process.env.GRAVITY_FORMS_FORM_ID);

	if (!apiUrl || !consumerKey || !consumerSecret || !formId) return null;

	return {
		apiUrl: apiUrl.replace(/\/+$/, ""),
		consumerKey,
		consumerSecret,
		formId,
	};
}

// POST /entries skips Gravity Forms validation: the values must already match its choices exactly.
export async function createGravityFormsEntry(
	config: GravityFormsConfig,
	entry: GravityFormsEntry,
): Promise<number | undefined> {
	const credentials = Buffer.from(
		`${config.consumerKey}:${config.consumerSecret}`,
	).toString("base64");

	const response = await fetch(`${config.apiUrl}/entries`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${credentials}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ form_id: config.formId, ...entry }),
		signal: AbortSignal.timeout(10_000),
	});

	if (!response.ok) {
		const body = await response.text().catch(() => "");
		throw new Error(
			`Gravity Forms responded ${response.status}: ${body.slice(0, 500)}`,
		);
	}

	const created = (await response.json().catch(() => null)) as {
		id?: number | string;
	} | null;
	return created?.id === undefined ? undefined : Number(created.id);
}

const FIELDS = {
	civility: "1",
	email: "3",
	departement: "6",
	objet: "15",
	classification: "16",
	sexe: "17",
	ageRange: "18",
	newsletter: "23",
	consent: "24",
	message: "27",
	lastName: "28",
	firstName: "29",
} as const;

const GF_DEPARTEMENTS = [
	"01 - Ain",
	"02 - Aisne",
	"03 - Allier",
	"04 - Alpes-de-Haute-Provence",
	"05 - Hautes-alpes",
	"06 - Alpes-maritimes",
	"07 - Ardèche",
	"08 - Ardennes",
	"09 - Ariège",
	"10 - Aube",
	"11 - Aude",
	"12 - Aveyron",
	"13 - Bouches-du-Rhône",
	"14 - Calvados",
	"15 - Cantal",
	"16 - Charente",
	"17 - Charente-maritime",
	"18 - Cher",
	"19 - Corrèze",
	"20 - Corse",
	"21 - Côte-d'Or",
	"22 - Côtes-d'Armor",
	"23 - Creuse",
	"24 - Dordogne",
	"25 - Doubs",
	"26 - Drôme",
	"27 - Eure",
	"28 - Eure-et-loir",
	"29 - Finistère",
	"30 - Gard",
	"31 - Haute-garonne",
	"32 - Gers",
	"33 - Gironde",
	"34 - Hérault",
	"35 - Ille-et-vilaine",
	"36 - Indre",
	"37 - Indre-et-loire",
	"38 - Isère",
	"39 - Jura",
	"40 - Landes",
	"41 - Loir-et-cher",
	"42 - Loire",
	"43 - Haute-loire",
	"44 - Loire-atlantique",
	"45 - Loiret",
	"46 - Lot",
	"47 - Lot-et-garonne",
	"48 - Lozère",
	"49 - Maine-et-loire",
	"50 - Manche",
	"51 - Marne",
	"52 - Haute-marne",
	"53 - Mayenne",
	"54 - Meurthe-et-moselle",
	"55 - Meuse",
	"56 - Morbihan",
	"57 - Moselle",
	"58 - Nièvre",
	"59 - Nord",
	"60 - Oise",
	"61 - Orne",
	"62 - Pas-de-calais",
	"63 - Puy-de-dôme",
	"64 - Pyrénées-atlantiques",
	"65 - Hautes-Pyrénées",
	"66 - Pyrénées-orientales",
	"67 - Bas-rhin",
	"68 - Haut-rhin",
	"69 - Rhône",
	"70 - Haute-saône",
	"71 - Saône-et-loire",
	"72 - Sarthe",
	"73 - Savoie",
	"74 - Haute-savoie",
	"75 - Paris",
	"76 - Seine-maritime",
	"77 - Seine-et-marne",
	"78 - Yvelines",
	"79 - Deux-sèvres",
	"80 - Somme",
	"81 - Tarn",
	"82 - Tarn-et-Garonne",
	"83 - Var",
	"84 - Vaucluse",
	"85 - Vendée",
	"86 - Vienne",
	"87 - Haute-vienne",
	"88 - Vosges",
	"89 - Yonne",
	"90 - Territoire de belfort",
	"91 - Essonne",
	"92 - Hauts-de-seine",
	"93 - Seine-Saint-Denis",
	"94 - Val-de-marne",
	"95 - Val-d'Oise",
	"971 - Guadeloupe",
	"972 - Martinique",
	"973 - Guyane",
	"974 - La réunion",
	"976 - Mayotte",
];

const departementCode = (value: string) => value.split(" - ")[0];

const GF_DEPARTEMENT_BY_CODE = new Map(
	GF_DEPARTEMENTS.map((value) => [departementCode(value), value]),
);

const GF_CLASSIFICATIONS: Partial<Record<Classification, string>> = {
	"Parent d’un enfant concerné": "Parent d'un enfant",
};

export function toGravityFormsEntry(
	input: ContactParticuliersInput,
): GravityFormsEntry {
	const entry: GravityFormsEntry = {
		[FIELDS.lastName]: input.lastName,
		[FIELDS.firstName]: input.firstName,
		[FIELDS.email]: input.email,
		[FIELDS.objet]: input.objet,
		[FIELDS.classification]:
			GF_CLASSIFICATIONS[input.classification] ?? input.classification,
		[FIELDS.message]: input.message,
		[`${FIELDS.consent}.1`]: "1",
		[`${FIELDS.consent}.2`]: CONSENT_LABEL,
	};

	if (input.civility) entry[FIELDS.civility] = input.civility;
	if (input.departement) {
		entry[FIELDS.departement] =
			GF_DEPARTEMENT_BY_CODE.get(departementCode(input.departement)) ??
			input.departement;
	}
	if (input.sexe) entry[FIELDS.sexe] = input.sexe;
	if (input.ageRange) entry[FIELDS.ageRange] = input.ageRange;
	if (input.newsletter) {
		entry[`${FIELDS.newsletter}.1`] = "1";
		entry[`${FIELDS.newsletter}.2`] = NEWSLETTER_LABEL;
	}

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
	if (siteUrl) entry.source_url = `${siteUrl}/contact-particuliers`;

	return entry;
}
