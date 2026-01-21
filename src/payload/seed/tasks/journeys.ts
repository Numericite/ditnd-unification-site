import type { Payload } from "payload";
import { TRPCError } from "@trpc/server";

const journeys = [
	{
		journey_name: "Je suis un parent ou un proche intéressé par l'autisme",
		persona: 1,
		chapter: [
			{
				"chapter-name": "Comprendre l'autisme chez mon enfant / proche",
				"practical-guides": [1, 2],
				courses: [1, 2],
			},
			{
				"chapter-name": "Repérage, diagnostic et parcours de soins",
				"practical-guides": [2],
				courses: [3],
			},
		],
	},
	{
		journey_name: "L'autisme",
		persona: 2,
		chapter: [
			{
				"chapter-name": "Repérage, diagnostic et parcours de soins",
				"practical-guides": [2],
				courses: [1, 2],
			},
		],
	},
];

async function createJourneys(
	payload: Payload,
	data: {
		journey_name: string;
		persona: number;
		chapter: {
			"chapter-name": string;
			"practical-guides": number[];
			courses: number[];
		}[];
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
