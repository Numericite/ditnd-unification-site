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
			}),
		)
		.query(async ({ input, ctx }): Promise<AugmentedCourse[]> => {
			const whereConditions: Where[] = [];

			const { conditions, themes, personas, type, text } = input;

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
					const vectorResults = await (ctx.payload.db as any).drizzle.execute(sql`
						SELECT doc_id
						FROM courses_search_vectors
						ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
						LIMIT 50
					`);
					matchingIds = (vectorResults.rows as { doc_id: string }[])
						.map((row) => parseInt(row.doc_id, 10))
						.filter((id) => !isNaN(id));
				} catch (err) {
					console.warn("[VectorSearch] Course semantic search failed, falling back to keyword search:", err);
				}

				// 2. Fallback to keyword search if vector search returned nothing
				if (matchingIds.length === 0) {
					const keywordResult = await ctx.payload.find({
						collection: "courses",
						limit: 0,
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
					return [];
				}

				whereConditions.push({
					id: { in: matchingIds.map(String) },
				});
			}

			const result = await ctx.payload.find({
				collection: "courses",
				depth: 1,
				limit: 0,
				select: {
					updatedAt: false,
					createdAt: false,
				},
				where: whereConditions.length ? { and: whereConditions } : undefined,
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

			return result.docs as AugmentedCourse[];
		}),
});
