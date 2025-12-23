import { z } from "zod";
import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";
import type { GuidesItems } from "~/components/PracticalGuides/PracticalGuidesDisplay";

const payload = await getPayload({ config: payloadConfig });

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

function getFirstRelation<T>(value: unknown): T | undefined {
  if (!Array.isArray(value)) return undefined;

  const firstValue = value[0];
  return typeof firstValue === "object" && firstValue !== null
    ? (firstValue as T)
    : undefined;
}

export const practicalGuidesRouter = createTRPCRouter({
  display: publicProcedure.query(async (): Promise<GuidesItems[]> => {
    const result = await payload.find({
      collection: "practical-guides",
      depth: 1,
      select: {
        updatedAt: false,
        createdAt: false,
        html: false,
        content: false,
        courses: false,
      },
    });

    return result.docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      condition: getFirstRelation(doc.conditions),
      persona: getFirstRelation(doc.persona),
      theme: getFirstRelation(doc.theme),
    }));
  }),

  getByFilters: publicProcedure
    .input(
      z.object({
        conditions: z.array(z.string()).optional(),
        themes: z.array(z.string()).optional(),
        personas: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      const where: Record<string, any> = {};

      if (input.conditions?.length) {
        where["conditions.slug"] = {
          in: input.conditions,
        };
      }
      if (input.themes?.length) {
        where["theme.slug"] = {
          in: input.themes,
        };
      }
      if (input.personas?.length) {
        where["persona.slug"] = {
          in: input.personas,
        };
      }
      console.log(input);

      const result = await payload.find({
        collection: "practical-guides",
        depth: 1,
        select: {
          updatedAt: false,
          createdAt: false,
          html: false,
          content: false,
          courses: false,
        },
        where,
      });
      return result.docs;
    }),
});
