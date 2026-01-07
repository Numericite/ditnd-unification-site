import { z } from "zod";
import type { GuidesItems } from "~/components/PracticalGuides/SearchGuidesDisplay";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { FiltersQuery } from "~/components/PracticalGuides/FiltersDisplay";
import type { Where } from "payload";

type PracticalGuidePayload = {
	id: number;
	title: string;
	slug: string;
	description: string;
	conditions?: (number | FiltersQuery)[] | null;
	persona: (number | FiltersQuery)[];
	theme: (number | FiltersQuery)[];
};

function getFirstRelation<T extends { id: number; name: string; slug: string }>(
	value: unknown,
): T | undefined {
	if (!Array.isArray(value)) return undefined;

	const first = value.find((v): v is T => typeof v === "object" && v !== null);

	return first;
}

function mappingResults(docs: PracticalGuidePayload[]): GuidesItems[] {
	return docs.map((doc) => ({
		id: doc.id,
		title: doc.title,
		slug: doc.slug,
		description: doc.description,
		condition: getFirstRelation(doc.conditions),
		persona: getFirstRelation(doc.persona),
		theme: getFirstRelation(doc.theme),
	}));
}

export const practicalGuidesRouter = createTRPCRouter({
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const result = await ctx.payload.find({
				collection: "practical-guides",
				limit: 0,
				where: {
					slug: {
						equals: input.slug,
					},
				},
			});

			return result.docs;
		}),

	getByFilters: publicProcedure
		.input(
			z.object({
				conditions: z.array(z.string()).optional(),
				themes: z.array(z.string()),
				personas: z.array(z.string()),
				text: z.string().optional(),
			}),
		)
		.query(async ({ input, ctx }): Promise<GuidesItems[]> => {
			const whereConditions: Where[] = [];

			const { conditions, themes, personas, text } = input;

			if (conditions?.length) {
				whereConditions.push({
					"conditions.slug": { in: conditions },
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

			const trimmedText = text?.trim();

			if (trimmedText) {
				whereConditions.push({
					or: [
						{ title: { contains: trimmedText } },
						{ description: { contains: trimmedText } },
						{ html: { contains: trimmedText } },
					],
				});
			}

			const result = await ctx.payload.find({
				collection: "practical-guides",
				depth: 1,
				limit: 0,

				select: {
					updatedAt: false,
					createdAt: false,
					html: false,
					content: false,
					courses: false,
				},
				where: whereConditions.length ? { and: whereConditions } : undefined,
			});

			return mappingResults(result.docs as PracticalGuidePayload[]);
		}),
});
