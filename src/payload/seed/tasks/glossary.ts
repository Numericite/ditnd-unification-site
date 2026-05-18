import type { Payload } from "payload";

type GlossaryEntry = {
	name: string;
	description: string;
	link?: string;
};

const glossary: GlossaryEntry[] = [
	{
		name: "AAH",
		description: "Allocation aux adultes handicapés.",
		link: "https://www.service-public.gouv.fr/particuliers/vosdroits/F12242",
	},
	{
		name: "AEEH",
		description: "Allocation d’éducation de l’enfant handicapé.",
		link: "https://www.service-public.gouv.fr/particuliers/vosdroits/F14809",
	},
	{
		name: "AESH",
		description:
			"Accompagnants des élèves en situation de Handicap (autrefois appelé AVS, auxiliaire de vie scolaire).",
		link: "https://www.monparcourshandicap.gouv.fr/glossaire/aesh",
	},
	{
		name: "AGED",
		description: "Allocation de garde d’enfant à domicile.",
		link: "https://www.caf.fr/allocataires/vies-de-famille/articles/une-aide-pour-garder-votre-enfant-domicile",
	},
	{
		name: "AGEFIPH",
		description:
			"Association de Gestion du Fonds pour l’Insertion Professionnelle des Personnes Handicapées.",
		link: "https://www.agefiph.fr/",
	},
	{
		name: "ANECAMSP",
		description:
			"Association Nationale des Équipes Contribuant A l’Action Médico Sociale Précoce.",
		link: "https://anecamsp.org/",
	},
	{
		name: "ANFH",
		description:
			"Association Nationale pour la Formation permanente du personnel Hospitalier.",
		link: "https://www.anfh.fr/",
	},
	{
		name: "CAJ",
		description: "Centre d’accueil de jour.",
	},
	{
		name: "CAMSP",
		description: "Centre d’action médico-sociale précoce.",
		link: "https://anecamsp.org/vous-aider-les-camsp/",
	},
	{
		name: "CCAS",
		description: "Centre communal d’action sociale.",
	},
	{
		name: "CDAPH",
		description:
			"Commissions des droits et de l’autonomie des personnes handicapées.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/dossier-mdph-autisme/",
	},
	{
		name: "CHRU",
		description: "Centre hospitalier régional universitaire.",
	},
	{
		name: "CHU",
		description: "Centre hospitalier universitaire.",
	},
	{
		name: "CMP",
		description: "Centre médico-psychologique.",
	},
	{
		name: "CMPP",
		description: "Centre médico-psycho-pédagogique.",
	},
	{
		name: "CNAF",
		description: "Caisse Nationale des allocations familiales.",
		link: "https://caf.fr/",
	},
	{
		name: "CNAM",
		description: "Caisse Nationale d’Assurance Maladie.",
		link: "https://www.ameli.fr/",
	},
	{
		name: "CNIA",
		description: "Certificat national autisme.",
		link: "https://maisondelautisme.gouv.fr/accueil-se-former-tnd/cnia/",
	},
	{
		name: "CNSA",
		description: "Caisse nationale pour la solidarité et l’autonomie.",
		link: "https://www.cnsa.fr/",
	},
	{
		name: "CRA",
		description: "Centre de ressources autisme.",
		link: "https://maisondelautisme.gouv.fr/accueil/centre-ressources-autisme-cra/",
	},
	{
		name: "CREAI",
		description: "Centre régional pour l’enfance et l’adolescence inadapté.",
	},
	{
		name: "CRMH",
		description: "Centre de Ressources MultiHandicap.",
		link: "https://www.crmh.fr/",
	},
	{
		name: "DAR",
		description: "Dispositif d’autorégulation.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/dispositif-scolarisation-tnd/",
	},
	{
		name: "DI-TND",
		description:
			"Délégation interministérielle à la stratégie nationale 2023-2027 pour les troubles du neurodéveloppement.",
	},
	{
		name: "DSM-5",
		description:
			"Manuel diagnostique et statistique des troubles mentaux, et des troubles psychiatriques.",
	},
	{
		name: "ESAT",
		description: "Établissement et service d’aide par le travail.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/travailler-quand-on-est-autiste/",
	},
	{
		name: "ESMS",
		description: "Établissement ou service médico-social.",
	},
	{
		name: "ESS",
		description: "Équipe de suivi de scolarisation.",
	},
	{
		name: "FAM",
		description: "Foyer d’accueil médicalisé.",
	},
	{
		name: "FDT",
		description: "Foyer à double tarification.",
	},
	{
		name: "FDV",
		description: "Foyer de vie.",
	},
	{
		name: "FEDEEH",
		description:
			"Fédération Etudiante pour une Dynamique Études et Emploi avec un Handicap.",
		link: "https://www.handinamique.org/",
	},
	{
		name: "FH",
		description: "Foyer d’hébergement.",
	},
	{
		name: "FIPHFP",
		description:
			"Fonds pour l’Insertion des Personnes Handicapées dans la Fonction Publique.",
		link: "http://www.fiphfp.fr/",
	},
	{
		name: "GEM",
		description: "Groupement d’entraide mutuelle.",
	},
	{
		name: "GIS",
		description: "Groupement d’intérêt scientifique.",
	},
	{
		name: "GNCRA",
		description: "Groupement national des centres de ressources autisme.",
		link: "https://gncra.fr/",
	},
	{
		name: "HAS",
		description: "Haute autorité de santé.",
		link: "https://www.has-sante.fr/",
	},
	{
		name: "IME",
		description: "Institut médico-éducatif.",
	},
	{
		name: "IMP",
		description: "Institut médico-pédagogique.",
	},
	{
		name: "IMPRO",
		description: "Institut médico-professionnel.",
	},
	{
		name: "MAS",
		description: "Maison d’accueil spécialisée.",
	},
	{
		name: "MDPH",
		description: "Maison départementale des personnes handicapées.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/dossier-mdph-autisme/",
	},
	{
		name: "OETH",
		description: "Obligation d’emploi de travailleur handicapé.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/travailler-quand-on-est-autiste/",
	},
	{
		name: "PCH",
		description: "Prestation de compensation du handicap.",
		link: "https://www.service-public.gouv.fr/particuliers/vosdroits/F14202",
	},
	{
		name: "RBPP",
		description: "Recommandation des bonnes pratiques professionnelles.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/rbpp-tnd/",
	},
	{
		name: "RQTH",
		description: "Reconnaissance de la qualité de travailleur handicapé.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/travailler-quand-on-est-autiste/",
	},
	{
		name: "SAAD",
		description: "Service d’aide et d’accompagnement à domicile.",
	},
	{
		name: "SAJ",
		description: "Service d’accueil de jour.",
	},
	{
		name: "SAJH",
		description: "Service d’accueil de jour et d’hébergement.",
	},
	{
		name: "SAMSAH",
		description:
			"Service d’accompagnement médico-social pour adultes handicapés.",
	},
	{
		name: "SEGPA",
		description: "Sections d’enseignement général adapté.",
	},
	{
		name: "SESSAD",
		description: "Service d’éducation spéciale et de soins à domicile.",
	},
	{
		name: "TDA/H",
		description:
			"Trouble du déficit de l’attention avec ou sans hyperactivité.",
	},
	{
		name: "TDI",
		description: "Trouble du développement intellectuel.",
	},
	{
		name: "TED",
		description: "Troubles envahissants du développement.",
	},
	{
		name: "TND",
		description: "Troubles du neuro-développement.",
	},
	{
		name: "TSA",
		description: "Troubles du spectre de l’autisme.",
	},
	{
		name: "TSLA",
		description: "Troubles spécifiques du langage et des apprentissages.",
	},
	{
		name: "UEEA",
		description: "Unité d’enseignement en élémentaire Autisme.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/dispositif-scolarisation-tnd/",
	},
	{
		name: "UEMA",
		description: "Unités d’enseignement en maternelle Autisme.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/dispositif-scolarisation-tnd/",
	},
	{
		name: "ULIS",
		description: "Unités localisées pour l’inclusion scolaire.",
		link: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/dispositif-scolarisation-tnd/",
	},
];

async function createGlossaryEntry(
	payload: Payload,
	data: GlossaryEntry,
): Promise<void> {
	try {
		await payload.create({
			collection: "glossary",
			data,
		});
	} catch (error) {
		throw new Error(
			`Error creating glossary entry ${data.name} with error ${error}`,
		);
	}
}

export async function seedGlossary(payload: Payload) {
	for (const entry of glossary) {
		await createGlossaryEntry(payload, entry);
	}
}
