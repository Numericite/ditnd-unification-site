import { TRPCError } from "@trpc/server";
import type { Payload } from "payload";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Media, Page, PageSection } from "~/payload/payload-types";
import { pagePath } from "~/utils/pages";

export interface AugmentedPage extends Omit<Page, "imageBanner" | "section"> {
	imageBanner: Media | null;
	section?: PageSection | null;
	meta?: {
		title?: string | null;
		description?: string | null;
		image?: Media | null;
	};
}

const sectionWithLinks = async (payload: Payload, section: PageSection) => {
	const pages = await payload.find({
		collection: "pages",
		limit: 0,
		depth: 0,
		draft: false,
		sort: ["createdAt", "id"],
		select: { title: true, slug: true },
		where: {
			section: { equals: section.id },
			_status: { equals: "published" },
		},
	});

	const links = pages.docs.map((page) => ({
		title: page.title,
		href: pagePath({ slug: page.slug, section }),
	}));

	return { section, links };
};

export const pagesRouter = createTRPCRouter({
	getBySlug: publicProcedure
		.input(
			z.object({
				slug: z.string(),
				// Identifiant de la rubrique, null pour une page à la racine.
				section: z.string().nullable().default(null),
			}),
		)
		.query(async ({ input, ctx }) => {
			const result = await ctx.payload.find({
				collection: "pages",
				limit: 1,
				depth: 2,
				draft: false,
				where: {
					slug: { equals: input.slug },
					_status: { equals: "published" },
					...(input.section
						? { "section.slug": { equals: input.section } }
						: { section: { exists: false } }),
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
	getSection: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const { docs } = await ctx.payload.find({
				collection: "page-sections",
				limit: 1,
				depth: 0,
				where: { slug: { equals: input.slug } },
			});
			const section = docs[0];
			if (!section) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `No section found for slug: ${input.slug}`,
				});
			}

			return sectionWithLinks(ctx.payload, section);
		}),
	listSections: publicProcedure.query(async ({ ctx }) => {
		const { docs } = await ctx.payload.find({
			collection: "page-sections",
			limit: 0,
			depth: 0,
			sort: "title",
		});
		return Promise.all(
			docs.map((section) => sectionWithLinks(ctx.payload, section)),
		);
	}),
});
