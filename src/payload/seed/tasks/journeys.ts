import type { Payload } from "payload";
import { TRPCError } from "@trpc/server";

const journeys = [
	{
		journey_name: "Je suis un parent ou un proche intéressé par l'autisme",
		description:
			"L’autisme, ou trouble du spectre de l’autisme (TSA), est un trouble du neurodéveloppement qui se manifeste dès l’enfance et qui accompagne la personne tout au long de sa vie. Il se caractérise principalement par des difficultés dans la communication et les interactions sociales, ainsi que par des comportements et intérêts restreints et répétitifs.",
		persona: {
			persona: 1,
			condition: 6,
			chapter: [
				{
					"chapter-name": "Comprendre l'autisme chez mon enfant / proche",
					"practical-guides": [1, 2],
				},
				{
					"chapter-name": "Repérage, diagnostic et parcours de soins",
					"practical-guides": [2],
				},
			],
		},
	},
	{
		journey_name: "L'autisme",
		description: "test",
		persona: {
			persona: 2,
			condition: 3,
			chapter: [
				{
					"chapter-name": "Repérage, diagnostic et parcours de soins",
					"practical-guides": [2],
				},
			],
		},
	},
];

async function createJourneys(
	payload: Payload,
	data: {
		journey_name: string;
		description: string;
		persona: {
			persona: number;
			condition: number;
			chapter: Array<{
				"chapter-name": string;
				"practical-guides": number[];
			}>;
		};
	},
): Promise<void> {
	try {
		await payload.create({
			collection: "journeys",
			data,
		});
	} catch (error) {
		throw new TRPCError({
			message: `Error creating journeys ${error}`,
			code: "INTERNAL_SERVER_ERROR",
		});
	}
}

export async function seedJourneys(payload: Payload) {
	for (const journey of journeys) {
		await createJourneys(payload, journey);
	}
}
