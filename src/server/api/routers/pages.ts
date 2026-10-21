import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Media, Page } from "~/payload/payload-types";

export interface AugmentedPage extends Omit<Page, "imageBanner"> {
	imageBanner: Media | null;
	meta?: {
		title?: string | null;
		description?: string | null;
		image?: Media | null;
	};
}

export const pagesRouter = createTRPCRouter({
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const result = await ctx.payload.find({
				collection: "pages",
				limit: 1,
				depth: 2,
				draft: false,
				where: {
					slug: { equals: input.slug },
					_status: { equals: "published" },
				},
			});

			const page = result.docs[0];
			if (!page) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `No page found for slug: ${input.slug}`,
				});
			}

			const metaImage = page.meta?.image;

			return {
				...page,
				imageBanner:
					typeof page.imageBanner === "object" && page.imageBanner !== null
						? (page.imageBanner as Media)
						: null,
				meta: {
					...page.meta,
					image:
						typeof metaImage === "object" && metaImage !== null
							? (metaImage as Media)
							: null,
				},
			} as AugmentedPage;
		}),
});
