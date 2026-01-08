import type { Payload } from "payload";
import { TRPCError } from "@trpc/server";

const journeys = [
	{
		journey_name: "Trouble du langage",
		persona: {
			persona: 1,
			condition: 2,
			chapter: [
				{
					"chapter-name": "Comprendre l'autisme chez mon enfant / proche",
					"practical-guide-list": [
						{ "practical-guide": 1 },
						{ "practical-guide": 2 },
					],
				},
				{
					"chapter-name": "Repérage, diagnostic et parcours de soins",
					"practical-guide-list": [{ "practical-guide": 2 }],
				},
			],
		},
	},
	{
		journey_name: "L'autisme",
		persona: {
			persona: 2,
			condition: 3,
			chapter: [
				{
					"chapter-name": "Repérage, diagnostic et parcours de soins",
					"practical-guide-list": [{ "practical-guide": 2 }],
				},
			],
		},
	},
];

async function createJourneys(
	payload: Payload,
	data: {
		journey_name: string;
		persona: {
			persona: number;
			condition: number;
			chapter: Array<{
				"chapter-name": string;
				"practical-guide-list": Array<{
					"practical-guide": number;
				}>;
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
