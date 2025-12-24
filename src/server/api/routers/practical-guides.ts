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
import type { FiltersQuery } from "~/components/PracticalGuides/FiltersDisplay";

type PracticalGuidePayload = {
  id: number;
  title: string;
  description: string;
  conditions?: (number | FiltersQuery)[] | null;
  persona: (number | FiltersQuery)[];
  theme: (number | FiltersQuery)[];
};

function getFirstRelation<T extends { id: number; name: string; slug: string }>(
  value: unknown
): T | undefined {
  if (!Array.isArray(value)) return undefined;

  const first = value.find((v): v is T => typeof v === "object" && v !== null);

  return first;
}

function mappingResults(docs: PracticalGuidePayload[]): GuidesItems[] {
  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    condition: getFirstRelation(doc.conditions),
    persona: getFirstRelation(doc.persona),
    theme: getFirstRelation(doc.theme),
  }));
}

export const practicalGuidesRouter = createTRPCRouter({
  getByFilters: publicProcedure
    .input(
      z.object({
        conditions: z.array(z.string()).optional(),
        themes: z.array(z.string()),
        personas: z.array(z.string()),
      })
    )
    .query(async ({ input }): Promise<GuidesItems[]> => {
      const where: Record<string, any> = {};

      if (input.conditions?.length) {
        where["conditions.slug"] = {
          in: input.conditions,
        };
      }
      if (input.themes.length) {
        where["theme.slug"] = {
          in: input.themes,
        };
      }
      if (input.personas.length) {
        where["persona.slug"] = {
          in: input.personas,
        };
      }

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

      return mappingResults(result.docs as PracticalGuidePayload[]);
    }),

  getByInput: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
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
        where: {},
      });

      return mappingResults(result.docs as PracticalGuidePayload[]);
    }),
});
