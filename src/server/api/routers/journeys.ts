import { z } from "zod";
import type { Journey } from "~/payload/payload-types";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export interface AugmentedPracticalGuide extends Omit<Journey, ""> {}

export const journeyRouter = createTRPCRouter({
	getByPersonaAndCondition: publicProcedure
		.input(z.object({ persona: z.string(), condition: z.string() }))
		.query(async ({ input, ctx }) => {
			const result = await ctx.payload.find({
				collection: "journeys",
				limit: 0,
				depth: 1,
				select: {
					updatedAt: false,
					createdAt: false,
				},
				where: {
					"persona.condition.slug": {
						equals: input.condition,
					},
					"persona.persona.slug": {
						equals: input.persona,
					},
				},
			});
			return result.docs;
		}),
});
