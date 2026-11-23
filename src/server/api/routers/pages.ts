import { TRPCError } from "@trpc/server";
import type { Payload } from "payload";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Media, Page, PageSection } from "~/payload/payload-types";
import { pagePath } from "~/utils/pages";
import { firstParagraphText } from "~/utils/tools";

export interface AugmentedPage extends Omit<Page, "imageBanner" | "section"> {
	imageBanner: Media | null;
	section?: PageSection | null;
	meta?: {
		title?: string | null;
		description?: string | null;
		image?: Media | null;
	};
}

/** Page proposée par la recherche globale ou le chatbot. */
export type PageCard = {
	id: number;
	title: string;
	description: string | null;
	imageUrl: string | null;
	href: string;
};

/** Pages publiées, sous forme de cartes, dans l'ordre des identifiants. */
export const findPublishedPageCards = async (
	payload: Payload,
	ids: (number | string)[],
): Promise<PageCard[]> => {
	if (ids.length === 0) return [];

	const { docs } = await payload.find({
		collection: "pages",
		limit: 0,
		depth: 1,
		draft: false,
		select: {
			title: true,
			slug: true,
			section: true,
			imageBanner: true,
			meta: true,
			content: true,
		},
		populate: { "page-sections": { slug: true } },
		where: {
			id: { in: ids.map(String) },
			_status: { equals: "published" },
		},
	});

	const order = new Map(ids.map((id, index) => [String(id), index]));
	return docs
		.sort(
			(a, b) =>
				(order.get(String(a.id)) ?? Number.MAX_SAFE_INTEGER) -
				(order.get(String(b.id)) ?? Number.MAX_SAFE_INTEGER),
		)
		.map((page) => ({
			id: page.id,
			title: page.title,
			description:
				page.meta?.description || firstParagraphText(page.content) || null,
			imageUrl:
				typeof page.imageBanner === "object"
					? (page.imageBanner?.url ?? null)
					: null,
			href: pagePath(page),
		}));
};

const publishedPageLinks = async (
	payload: Payload,
	section: PageSection | null,
) => {
	const pages = await payload.find({
		collection: "pages",
		limit: 0,
		depth: 0,
		draft: false,
		sort: section ? ["createdAt", "id"] : "title",
		select: { title: true, slug: true },
		where: {
			section: section ? { equals: section.id } : { exists: false },
			_status: { equals: "published" },
		},
	});

	return pages.docs.map((page) => ({
		title: page.title,
		href: pagePath({ slug: page.slug, section }),
	}));
};

const sectionWithLinks = async (payload: Payload, section: PageSection) => ({
	section,
	links: await publishedPageLinks(payload, section),
});

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
	listRootPages: publicProcedure.query(({ ctx }) =>
		publishedPageLinks(ctx.payload, null),
	),
});
