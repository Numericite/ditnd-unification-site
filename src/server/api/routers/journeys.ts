import { z } from "zod";
import type { Journey, Persona } from "~/payload/payload-types";
import {
	createTRPCRouter,
	fetchOrReturnRealValue,
	publicProcedure,
} from "~/server/api/trpc";
import type { AugmentedPracticalGuide } from "./practical-guides";

export interface AugmentedJourney extends Omit<Journey, ""> {
	persona: Persona;
	chapter: Chapter[];
}

interface Chapter {
	"chapter-name": string;
	"practical-guides": AugmentedPracticalGuide[];
	id?: string;
}

export const journeyRouter = createTRPCRouter({
	getByPersona: publicProcedure
		.input(z.object({ persona: z.string() }))
		.query(async ({ input, ctx }) => {
			const result = await ctx.payload.find({
				collection: "journeys",
				limit: 0,
				depth: 2,
				where: {
					"persona.slug": {
						equals: input.persona,
					},
				},
			});

			const sanitizedResult = (await Promise.all(
				result.docs.map(async (journey) => {
					return {
						...journey,

						persona: await fetchOrReturnRealValue(journey.persona, "personas"),
						chapter: await Promise.all(
							journey.chapter.map(async (chap) => ({
								...chap,

								"practical-guides": await Promise.all(
									chap["practical-guides"].map(
										async (pg) =>
											await fetchOrReturnRealValue(pg, "practical-guides"),
									),
								),
							})),
						),
					};
				}),
			)) as AugmentedJourney[];

			return sanitizedResult;
		}),
});
