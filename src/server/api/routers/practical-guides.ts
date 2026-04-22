import { z } from "zod";
import { sql } from "@payloadcms/db-postgres";

import {
	createTRPCRouter,
	fetchOrReturnRealValue,
	publicProcedure,
	resolveRelations,
} from "~/server/api/trpc";
import type { Where } from "payload";
import { generateEmbedding } from "~/payload/services/embedding";
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
		.input(z.object({ slug: z.string(), draft: z.boolean().optional() }))
		.query(async ({ input, ctx }) => {
			const result = await ctx.payload.find({
				collection: "practical-guides",
				limit: 0,
				depth: 2,
				draft: input.draft ?? false,
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
			let matchingIds: number[] = [];

			if (trimmedText) {
				// 1. Try pgvector semantic similarity search
				try {
					const queryEmbedding = await generateEmbedding(trimmedText);
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const vectorResults = await (
						ctx.payload.db as any
					).drizzle.execute(sql`
            SELECT doc_id
            FROM practical_guide_search_vectors
            ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
            LIMIT 50
          `);
					matchingIds = (vectorResults.rows as { doc_id: string }[])
						.map((row) => parseInt(row.doc_id, 10))
						.filter((id) => !Number.isNaN(id));
				} catch (err) {
					console.warn(
						"[VectorSearch] Semantic search failed, falling back to keyword search:",
						err,
					);
				}

				// 2. Fallback to keyword search if vector search returned nothing
				if (matchingIds.length === 0) {
					const searchResults = await ctx.payload.find({
						collection: "search-results" as any,
						limit: 0,
						where: {
							or: [
								{ title: { contains: trimmedText } },
								{ description: { contains: trimmedText } },
								{ contentText: { contains: trimmedText } },
								{ conditionNames: { contains: trimmedText } },
								{ themeNames: { contains: trimmedText } },
								{ personaNames: { contains: trimmedText } },
							],
						},
					});
					matchingIds = (searchResults.docs as Record<string, any>[])
						.map((doc) => {
							const ref = doc.doc;
							if (!ref) return null;
							return typeof ref.value === "number"
								? ref.value
								: typeof ref.value === "object" && ref.value !== null
									? (ref.value as { id: number }).id
									: null;
						})
						.filter((id): id is number => id !== null);
				}

				if (matchingIds.length === 0) {
					return [];
				}

				whereConditions.push({
					id: { in: matchingIds.map(String) },
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
				where: whereConditions.length ? { and: whereConditions } : {},
			});

			// Preserve vector similarity order when text search was used
			if (trimmedText && matchingIds.length > 0) {
				const orderMap = new Map(matchingIds.map((id, index) => [id, index]));
				result.docs.sort((a, b) => {
					const posA = orderMap.get(Number(a.id)) ?? Number.MAX_SAFE_INTEGER;
					const posB = orderMap.get(Number(b.id)) ?? Number.MAX_SAFE_INTEGER;
					return posA - posB;
				});
			}

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
