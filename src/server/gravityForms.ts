import {
	type Classification,
	CONSENT_LABEL,
	type ContactParticuliersInput,
	type Departement,
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

// Only the labels spelled differently in the Gravity Forms select.
const GF_DEPARTEMENTS: Partial<Record<Departement, string>> = {
	"05 - Hautes-Alpes": "05 - Hautes-alpes",
	"06 - Alpes-Maritimes": "06 - Alpes-maritimes",
	"17 - Charente-Maritime": "17 - Charente-maritime",
	"28 - Eure-et-Loir": "28 - Eure-et-loir",
	"31 - Haute-Garonne": "31 - Haute-garonne",
	"35 - Ille-et-Vilaine": "35 - Ille-et-vilaine",
	"37 - Indre-et-Loire": "37 - Indre-et-loire",
	"41 - Loir-et-Cher": "41 - Loir-et-cher",
	"43 - Haute-Loire": "43 - Haute-loire",
	"44 - Loire-Atlantique": "44 - Loire-atlantique",
	"47 - Lot-et-Garonne": "47 - Lot-et-garonne",
	"49 - Maine-et-Loire": "49 - Maine-et-loire",
	"52 - Haute-Marne": "52 - Haute-marne",
	"54 - Meurthe-et-Moselle": "54 - Meurthe-et-moselle",
	"62 - Pas-de-Calais": "62 - Pas-de-calais",
	"63 - Puy-de-Dôme": "63 - Puy-de-dôme",
	"64 - Pyrenées-Atlantiques": "64 - Pyrénées-atlantiques",
	"65 - Hautes-Pyrenées": "65 - Hautes-Pyrénées",
	"66 - Pyrenées-Orientales": "66 - Pyrénées-orientales",
	"67 - Bas-Rhin": "67 - Bas-rhin",
	"68 - Haut-Rhin": "68 - Haut-rhin",
	"70 - Haute-Saône": "70 - Haute-saône",
	"71 - Saône-et-Loire": "71 - Saône-et-loire",
	"74 - Haute-Savoie": "74 - Haute-savoie",
	"76 - Seine-Maritime": "76 - Seine-maritime",
	"77 - Seine-et-Marne": "77 - Seine-et-marne",
	"79 - Deux-Sèvres": "79 - Deux-sèvres",
	"87 - Haute-Vienne": "87 - Haute-vienne",
	"90 - Territoire de Belfort": "90 - Territoire de belfort",
	"92 - Hauts-de-Seine": "92 - Hauts-de-seine",
	"94 - Val-de-Marne": "94 - Val-de-marne",
	"974 - La Réunion": "974 - La réunion",
};

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
			GF_DEPARTEMENTS[input.departement] ?? input.departement;
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
