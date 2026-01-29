import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const cmsRouter = createTRPCRouter({
	home: publicProcedure.query(async ({ ctx }) => {
		const res = await ctx.payload.findGlobal({
			slug: "home",
		});

		return res;
	}),

	footerTitle: publicProcedure.query(async ({ ctx }) => {
		const res = await ctx.payload.findGlobal({
			slug: "footer",
		});

		return res.title;
	}),

	accessibility: publicProcedure.query(async ({ ctx }) => {
		const res = await ctx.payload.findGlobal({
			slug: "footer",
		});

		return res.accessibility;
	}),
});
