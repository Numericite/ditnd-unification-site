import type { Payload } from "payload";

const conditions = [
	{
		name: "Troubles spécifiques des apprentissages",
		description: "Difficultés ciblées de lecture, écriture ou mathématiques.",
		fullDescription:
			"Les troubles spécifiques des apprentissages (DYS) regroupent plusieurs troubles qui affectent l'acquisition et la maîtrise de compétences fondamentales comme la lecture (dyslexie), l'orthographe (dysorthographie), l'écriture (dysgraphie) et les mathématiques (dyscalculie). Ces troubles sont d'origine neurologique et persistent tout au long de la vie. Ils ne sont pas liés à un manque d'intelligence ou d'efforts, mais à un fonctionnement différent du cerveau. Avec un accompagnement adapté, les personnes DYS peuvent développer des stratégies compensatoires efficaces.",
		acronym: "DYS",
		slug: "dys",
		textColor: "#161616",
		backgroundColor: "#F6F6F6",
	},
	{
		name: "Trouble du déficit de l'attention avec ou sans hyperactivité",
		description: "Difficultés d'attention, impulsivité et agitation.",
		fullDescription:
			"Le TDAH est un trouble neurodéveloppemental caractérisé par des difficultés persistantes d'attention, une impulsivité et, parfois, une hyperactivité. Il se manifeste dans différents contextes de vie — école, travail, vie sociale — et peut avoir un impact significatif sur les apprentissages et les relations. Il existe trois présentations principales : inattentive, hyperactive-impulsive, ou combinée. Le TDAH concerne aussi bien les enfants que les adultes, et un diagnostic précoce permet de mettre en place des stratégies d'accompagnement adaptées.",
		acronym: "TDAH",
		slug: "tdah",
		textColor: "#6E445A",
		backgroundColor: "#fef3fd",
	},
	{
		name: "Trouble du développement intellectuel",
		description:
			"Limitations des capacités intellectuelles et du fonctionnement adaptatif.",
		fullDescription:
			"Le trouble du développement intellectuel (TDI), anciennement appelé déficience intellectuelle, se caractérise par des limitations significatives des fonctions intellectuelles et du comportement adaptatif. Ces limitations apparaissent pendant la période de développement et affectent les aptitudes conceptuelles, sociales et pratiques. Le TDI se présente avec des niveaux de sévérité variables — léger, moyen, grave ou profond — et peut être associé à d'autres troubles. Un accompagnement médico-social et éducatif adapté favorise l'autonomie et l'inclusion des personnes concernées.",
		acronym: "TDI",
		slug: "tdi",
		textColor: "#161616",
		backgroundColor: "#F6F6F6",
	},
	{
		name: "Trouble du spectre autistique",
		description:
			"Trouble du neurodéveloppement affectant la communication et les interactions sociales.",
		fullDescription:
			"Le trouble du spectre de l'autisme (TSA) est un trouble du neurodéveloppement qui se manifeste dès l'enfance et qui accompagne la personne tout au long de sa vie. Il se caractérise principalement par des particularités dans la communication et les interactions sociales, ainsi que par des comportements, intérêts ou activités restreints et répétitifs. Le TSA est un spectre large : chaque personne autiste est unique, avec ses propres forces et difficultés. Un diagnostic précoce et un accompagnement personnalisé permettent d'améliorer significativement la qualité de vie des personnes et de leurs familles.",
		acronym: "TSA",
		slug: "tsa",
		textColor: "#000091",
		backgroundColor: "#f4f6ff",
	},
];

async function createConditions(
	payload: Payload,
	data: {
		name: string;
		description: string;
		fullDescription: string;
		acronym: string;
		slug: string;
		textColor: string;
		backgroundColor: string;
	},
): Promise<void> {
	try {
		await payload.create({
			collection: "conditions",
			data,
		});
	} catch (error) {
		throw new Error(
			`Error creating conditions ${data.acronym} with error ${error}`,
		);
	}
}

export async function seedConditions(payload: Payload) {
	for (const condition of conditions) {
		await createConditions(payload, condition);
	}
}
