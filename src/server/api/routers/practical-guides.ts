import { z } from "zod";
import type { GuidesItems } from "~/components/PracticalGuides/SearchGuidesDisplay";

import {
	createTRPCRouter,
	publicProcedure,
	resolveRelations,
} from "~/server/api/trpc";
import type { FiltersQuery } from "~/components/PracticalGuides/FiltersDisplay";
import type { Where } from "payload";
import type {
	Condition,
	Course,
	PracticalGuide,
	Theme,
} from "~/payload/payload-types";
import type { AugmentedCourse } from "./courses";

type PracticalGuidePayload = {
	id: number;
	title: string;
	slug: string;
	description: string;
	conditions?: (number | FiltersQuery)[];
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

export interface AugmentedPracticalGuide extends Omit<PracticalGuide, ""> {
	theme: Theme[];
	conditions: Condition[];
	"practical-guides": PracticalGuide[];
	courses: AugmentedCourse[];
}

export const practicalGuidesRouter = createTRPCRouter({
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const result = await ctx.payload.find({
				collection: "practical-guides",
				limit: 0,
				depth: 2,
				where: {
					slug: {
						equals: input.slug,
					},
				},
			});

			const sanitizedResult = (await Promise.all(
				result.docs.map(async (guide) => {
					return {
						...guide,
						theme: await resolveRelations(guide.theme, "themes"),
						conditions: await resolveRelations(
							guide.conditions as Condition[],
							"conditions",
						),
						courses: await resolveRelations(
							guide.courses as Course[],
							"courses",
						),
						"practical-guides": await resolveRelations(
							guide["practical-guides"] as PracticalGuide[],
							"practical-guides",
						),
					};
				}),
			)) as AugmentedPracticalGuide[];

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
