import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Media, News, Persona } from "~/payload/payload-types";

export type AugmentedNews = Pick<
	News,
	"id" | "title" | "description" | "category" | "link"
> & {
	image: Media | null;
	personas?: Persona[] | null;
};

export const newsRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.payload.find({
			collection: "news",
			limit: 3,
			depth: 1,
			where: { _status: { equals: "published" } },
			select: {
				title: true,
				description: true,
				category: true,
				link: true,
				image: true,
				personas: true,
			},
		});

		return result.docs as AugmentedNews[];
	}),
});
