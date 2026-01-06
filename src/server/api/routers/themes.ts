import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const themeRouter = createTRPCRouter({
	all: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.payload.find({
			collection: "themes",
			limit: 0,
			select: {
				updatedAt: false,
				createdAt: false,
			},
		});

		return result.docs;
	}),
});
