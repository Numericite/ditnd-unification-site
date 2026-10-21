import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { TDH } from "~/state/store";

export const conditionRouter = createTRPCRouter({
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			// Case-insensitive: journey URLs are lowercased whatever the stored slug
			const result = await ctx.payload.find({
				collection: "conditions",
				where: { slug: { like: input.slug } },
				limit: 0,
			});
			const slug = input.slug.toLowerCase();
			return result.docs.find((doc) => doc.slug.toLowerCase() === slug) ?? null;
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
