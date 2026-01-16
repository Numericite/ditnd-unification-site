import type { Where } from "payload";
import { z } from "zod";
import type {
	Condition,
	Course,
	Persona,
	Theme,
} from "~/payload/payload-types";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export interface AugmentedCourse extends Omit<Course, ""> {
	theme: Theme;
	persona: Persona;
	condition: Condition;
}

export const courseRouter = createTRPCRouter({
	getByFilters: publicProcedure
		.input(
			z.object({
				conditions: z.array(z.string()),
				themes: z.array(z.string()),
				personas: z.array(z.string()),
				text: z.string(),
			}),
		)
		.query(async ({ input, ctx }): Promise<AugmentedCourse[]> => {
			const whereConditions: Where[] = [];

			const { conditions, themes, personas, text } = input;

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

			return result.docs as AugmentedCourse[];
		}),
});
