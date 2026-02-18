import { z } from "zod";

import {
	createTRPCRouter,
	fetchOrReturnRealValue,
	publicProcedure,
	resolveRelations,
} from "~/server/api/trpc";
import type { Where } from "payload";
import type {
	Condition,
	Media,
	PracticalGuide,
	PracticalGuideView,
	Theme,
} from "~/payload/payload-types";
import type { AugmentedCourse } from "./courses";

export interface AugmentedPracticalGuide extends PracticalGuide {
	themes: Theme[];
	conditions?: Condition[] | undefined;
	"practical-guides": AugmentedPracticalGuide[];
	courses: AugmentedCourse[];
	image: Media | undefined;
	imageBanner: Media | undefined;
	_status: "draft" | "published";
}

export interface AugmentedPracticalGuideViews extends PracticalGuideView {
	guide: AugmentedPracticalGuide;
}

export const practicalGuidesRouter = createTRPCRouter({
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const result = await ctx.payload.find({
				collection: "practical-guides",
				limit: 0,
				depth: 2,
				draft: false,
				where: {
					slug: {
						equals: input.slug,
					},
				},
			});

			const guide = result.docs[0];
			if (!guide)
				throw new Error("No guides found on practicalGuidesRouter - getBySlug");

			const sanitizedResult = (await Promise.all(
				result.docs.map(async (guide) => {
					if (!guide["practical-guides"] || !guide.courses) {
						throw new Error(
							"No guides found on practicalGuidesRouter - getBySlug",
						);
					}
					return {
						...guide,
						themes: await resolveRelations(guide.themes, "themes"),
						courses: await resolveRelations(guide.courses, "courses"),
						"practical-guides": await resolveRelations(
							guide["practical-guides"],
							"practical-guides",
						),
					};
				}),
			)) as AugmentedPracticalGuide[];

			return sanitizedResult[0];
		}),

	getByViews: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.payload.find({
			collection: "practical-guide-views",
			limit: 6,
			depth: 2,
			sort: "-viewCount",
			draft: false,
		});

		const sanitizedResult = await Promise.all(
			result.docs.map(async (view) => {
				const guide = await fetchOrReturnRealValue(
					view.guide,
					"practical-guides",
				);
				return {
					...guide,
					viewCount: view.viewCount,
					themes: await resolveRelations(guide.themes ?? [], "themes"),
					courses: await resolveRelations(guide.courses ?? [], "courses"),
					"practical-guides": await resolveRelations(
						guide["practical-guides"] ?? [],
						"practical-guides",
					),
				} as AugmentedPracticalGuide;
			}),
		);

		return sanitizedResult;
	}),

	getByFilters: publicProcedure
		.input(
			z.object({
				conditions: z.array(z.string()),
				themes: z.array(z.string()),
				personas: z.array(z.string()),
				text: z.string(),
			}),
		)
		.query(async ({ input, ctx }): Promise<AugmentedPracticalGuide[]> => {
			const whereConditions: Where[] = [];

			const { conditions, themes, personas, text } = input;

			if (conditions?.length) {
				whereConditions.push({
					"conditions.slug": { in: conditions },
				});
			}

			if (themes?.length) {
				whereConditions.push({
					"themes.slug": { in: themes },
				});
			}

			if (personas?.length) {
				whereConditions.push({
					"persona.slug": { in: personas },
				});
			}

			const trimmedText = text?.trim();

			if (trimmedText) {
				whereConditions.push({
					or: [
						{ title: { contains: trimmedText } },
						{ description: { contains: trimmedText } },
						{ html: { contains: trimmedText } },
						{ "conditions.acronym": { contains: trimmedText } },
						{ "themes.name": { contains: trimmedText } },
						{ "persona.name": { contains: trimmedText } },
					],
				});
			}

			const result = await ctx.payload.find({
				collection: "practical-guides",
				depth: 1,
				limit: 0,
				draft: false,
				select: {
					updatedAt: false,
					createdAt: false,
					html: false,
					content: false,
					courses: false,
				},
				where: { and: whereConditions },
			});

			return result.docs as AugmentedPracticalGuide[];
		}),
	incrementView: publicProcedure
		.input(z.object({ guideId: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const guide = await ctx.payload.find({
				collection: "practical-guide-views",
				where: {
					guide: {
						equals: input.guideId,
					},
				},
				limit: 1,
			});

			if (!guide.docs.length || !guide.docs[0]) {
				await ctx.payload.create({
					collection: "practical-guide-views",
					data: {
						guide: input.guideId,
						viewCount: 1,
					},
				});
			} else {
				await ctx.payload.update({
					collection: "practical-guide-views",
					id: guide.docs[0].id,
					data: {
						viewCount: guide.docs[0].viewCount + 1,
					},
				});
			}

			return { success: true };
		}),
});
