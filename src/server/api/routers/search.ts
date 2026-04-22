import { z } from "zod";
import { sql } from "@payloadcms/db-postgres";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateEmbedding } from "~/payload/services/embedding";
import type { AugmentedPracticalGuide } from "./practical-guides";
import type { AugmentedCourse } from "./courses";

export type GlobalSearchResult = {
	guides: AugmentedPracticalGuide[];
	courses: AugmentedCourse[];
};

export const searchRouter = createTRPCRouter({
	global: publicProcedure
		.input(
			z.object({
				text: z.string().min(1),
			}),
		)
		.query(async ({ input, ctx }): Promise<GlobalSearchResult> => {
			const trimmedText = input.text.trim();

			if (!trimmedText) {
				return { guides: [], courses: [] };
			}

			let guideIds: number[] = [];
			let courseIds: number[] = [];

			// Generate embedding once for both searches
			try {
				const queryEmbedding = await generateEmbedding(trimmedText);
				const embeddingJson = JSON.stringify(queryEmbedding);

				// Query both vector tables in parallel
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const drizzle = (ctx.payload.db as any).drizzle;

				const [guideVectorResults, courseVectorResults] = await Promise.all([
					drizzle.execute(sql`
            SELECT doc_id
            FROM practical_guide_search_vectors
            ORDER BY embedding <=> ${embeddingJson}::vector
            LIMIT 30
          `),
					drizzle.execute(sql`
            SELECT doc_id
            FROM courses_search_vectors
            ORDER BY embedding <=> ${embeddingJson}::vector
            LIMIT 30
          `),
				]);

				guideIds = (guideVectorResults.rows as { doc_id: string }[])
					.map((row) => parseInt(row.doc_id, 10))
					.filter((id) => !Number.isNaN(id));

				courseIds = (courseVectorResults.rows as { doc_id: string }[])
					.map((row) => parseInt(row.doc_id, 10))
					.filter((id) => !Number.isNaN(id));
			} catch (err) {
				console.warn(
					"[GlobalSearch] Semantic search failed, falling back to keyword search:",
					err,
				);
			}

			// Fallback to keyword search if vector search returned nothing
			if (guideIds.length === 0) {
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
				guideIds = (searchResults.docs as Record<string, any>[])
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

			if (courseIds.length === 0) {
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
				courseIds = keywordResult.docs.map((doc) => doc.id);
			}

			// Fetch actual documents in parallel
			const [guidesResult, coursesResult] = await Promise.all([
				guideIds.length > 0
					? ctx.payload.find({
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
							where: { id: { in: guideIds.map(String) } },
						})
					: Promise.resolve({ docs: [] }),
				courseIds.length > 0
					? ctx.payload.find({
							collection: "courses",
							depth: 1,
							limit: 0,
							select: {
								updatedAt: false,
								createdAt: false,
							},
							where: { id: { in: courseIds.map(String) } },
						})
					: Promise.resolve({ docs: [] }),
			]);

			// Preserve vector similarity order
			const guideOrderMap = new Map(guideIds.map((id, i) => [id, i]));
			const courseOrderMap = new Map(courseIds.map((id, i) => [id, i]));

			const sortedGuides = [...guidesResult.docs].sort((a, b) => {
				const posA = guideOrderMap.get(Number(a.id)) ?? Number.MAX_SAFE_INTEGER;
				const posB = guideOrderMap.get(Number(b.id)) ?? Number.MAX_SAFE_INTEGER;
				return posA - posB;
			});

			const sortedCourses = [...coursesResult.docs].sort((a, b) => {
				const posA =
					courseOrderMap.get(Number(a.id)) ?? Number.MAX_SAFE_INTEGER;
				const posB =
					courseOrderMap.get(Number(b.id)) ?? Number.MAX_SAFE_INTEGER;
				return posA - posB;
			});

			return {
				guides: sortedGuides as AugmentedPracticalGuide[],
				courses: sortedCourses as AugmentedCourse[],
			};
		}),
});
