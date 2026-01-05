import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { TDH } from "~/state/store";

export const conditionRouter = createTRPCRouter({
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
