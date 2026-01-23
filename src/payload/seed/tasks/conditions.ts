import type { Payload } from "payload";
import { TRPCError } from "@trpc/server";

const conditions = [
	{
		name: "Troubles spécifiques des apprentissages",
		description: "Difficultés ciblées de lecture, écriture ou mathématiques.",
		acronym: "TSAp",
		slug: "tsap",
		textColor: "#161616",
		backgroundColor: "#F6F6F6",
	},
	{
		name: "Trouble du déficit de l’attention avec ou sans hyperactivité",
		description: "Difficultés d’attention, impulsivité et agitation.",
		acronym: "TDAH",
		slug: "tdah",
		textColor: "#6E445A",
		backgroundColor: "#fef3fd",
	},
	{
		name: "Trouble du développement intellectuel",
		description:
			"Limitations des capacités intellectuelles et du fonctionnement adaptatif.",
		acronym: "TDI",
		slug: "tdi",
		textColor: "#161616",
		backgroundColor: "#F6F6F6",
	},
	{
		name: "Trouble du spectre de l'autisme",
		description:
			"Trouble du neurodéveloppement affectant la communication et les interactions sociales.",
		acronym: "TSA",
		slug: "tsa",
		textColor: "#0078f3",
		backgroundColor: "#f4f6ff",
	},
	{
		name: "DYS",
		description:
			"Troubles cognitifs spécifiques qui affectent certaines fonctions humaines",
		acronym: "dys",
		slug: "dys",
		textColor: "#8D533E",
		backgroundColor: "#fef4f2",
	},
];

async function createConditions(
	payload: Payload,
	data: {
		name: string;
		description: string;
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
		throw new TRPCError({
			message: `Error creating conditions ${data.acronym} with error ${error}`,
			code: "INTERNAL_SERVER_ERROR",
		});
	}
}

export async function seedConditions(payload: Payload) {
	for (const condition of conditions) {
		await createConditions(payload, condition);
	}
}
