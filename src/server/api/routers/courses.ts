import type { Where } from "payload";
import { z } from "zod";
import { sql } from "@payloadcms/db-postgres";
import type {
	Condition,
	Course,
	Media,
	Persona,
	Theme,
} from "~/payload/payload-types";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateEmbedding } from "~/payload/services/embedding";
import {
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	VECTOR_SEARCH_CAP,
	emptyPage,
	type PaginatedResult,
} from "~/utils/pagination";

export interface AugmentedCourse extends Course {
	theme: Theme;
	persona: Persona;
	condition: Condition;
	image: Media;
	_status?: "draft" | "published";
}

export const courseRouter = createTRPCRouter({
	getByFilters: publicProcedure
		.input(
			z.object({
				conditions: z.array(z.string()),
				themes: z.array(z.string()),
				personas: z.array(z.string()),
				type: z.array(z.string()),
				text: z.string(),
				page: z.number().int().min(1).default(1),
				limit: z
					.number()
					.int()
					.min(1)
					.max(MAX_PAGE_SIZE)
					.default(DEFAULT_PAGE_SIZE),
			}),
		)
		.query(
			async ({ input, ctx }): Promise<PaginatedResult<AugmentedCourse>> => {
				const whereConditions: Where[] = [];

				const { conditions, themes, personas, type, text, page, limit } = input;

				if (conditions?.length) {
					whereConditions.push({
						"condition.slug": { in: conditions },
					});
				}

				if (themes?.length) {
					whereConditions.push({
						"theme.slug": { in: themes },
					});
				}

				if (personas?.length) {
					whereConditions.push({
						"persona.slug": { in: personas },
					});
				}

				if (type?.length) {
					whereConditions.push({
						type: { in: type },
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
						FROM courses_search_vectors
						ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
						LIMIT ${VECTOR_SEARCH_CAP}
					`);
						matchingIds = (vectorResults.rows as { doc_id: string }[])
							.map((row) => parseInt(row.doc_id, 10))
							.filter((id) => !Number.isNaN(id));
					} catch (err) {
						console.warn(
							"[VectorSearch] Course semantic search failed, falling back to keyword search:",
							err,
						);
					}

					// 2. Fallback to keyword search if vector search returned nothing
					if (matchingIds.length === 0) {
						const keywordResult = await ctx.payload.find({
							collection: "courses",
							limit: VECTOR_SEARCH_CAP,
							where: {
								or: [
									{ title: { contains: trimmedText } },
									{ description: { contains: trimmedText } },
									{ "condition.acronym": { contains: trimmedText } },
									{ "persona.name": { contains: trimmedText } },
								],
							},
						});
						matchingIds = keywordResult.docs.map((doc) => doc.id);
					}

					if (matchingIds.length === 0) {
						return emptyPage<AugmentedCourse>(page, limit);
					}

					whereConditions.push({
						id: { in: matchingIds.map(String) },
					});

					// Text path: paginate in-memory on the similarity-ordered list.
					// Total is capped at VECTOR_SEARCH_CAP by design — an accepted tradeoff of vector search.
					const result = await ctx.payload.find({
						collection: "courses",
						depth: 1,
						limit: VECTOR_SEARCH_CAP,
						select: {
							updatedAt: false,
							createdAt: false,
						},
						where: { and: whereConditions },
					});

					const orderMap = new Map(matchingIds.map((id, index) => [id, index]));
					result.docs.sort((a, b) => {
						const posA = orderMap.get(Number(a.id)) ?? Number.MAX_SAFE_INTEGER;
						const posB = orderMap.get(Number(b.id)) ?? Number.MAX_SAFE_INTEGER;
						return posA - posB;
					});

					const total = result.docs.length;
					const offset = (page - 1) * limit;
					const items = result.docs.slice(
						offset,
						offset + limit,
					) as AugmentedCourse[];

					return {
						items,
						total,
						pageCount: Math.ceil(total / limit),
						page,
						limit,
					};
				}

				// No text: use Payload's native pagination (efficient SQL LIMIT/OFFSET).
				const result = await ctx.payload.find({
					collection: "courses",
					depth: 1,
					page,
					limit,
					select: {
						updatedAt: false,
						createdAt: false,
					},
					where: whereConditions.length ? { and: whereConditions } : undefined,
				});

				return {
					items: result.docs as AugmentedCourse[],
					total: result.totalDocs,
					pageCount: result.totalPages,
					page: result.page ?? page,
					limit: result.limit,
				};
			},
		),
});
