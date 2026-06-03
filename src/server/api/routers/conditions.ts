import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { TDH } from "~/state/store";

export const conditionRouter = createTRPCRouter({
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const result = await ctx.payload.find({
				collection: "conditions",
				where: { slug: { equals: input.slug } },
				limit: 1,
			});
			return result.docs[0] ?? null;
		}),
	all: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.payload.find({
			collection: "conditions",
			limit: 0,
			select: {
				updatedAt: false,
				createdAt: false,
			},
		});

		const res = result.docs.map(
			(condition): TDH => ({
				...condition,
				display: "condition",
			}),
		);
		return res;
	}),
});
