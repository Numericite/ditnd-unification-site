import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const cmsRouter = createTRPCRouter({
	home: publicProcedure.query(async ({ ctx }) => {
		const res = await ctx.payload.findGlobal({
			slug: "home",
		});

		return res;
	}),
});
