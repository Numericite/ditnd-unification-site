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
        text: z.string().optional(),
      })
    )
    .query(async ({ input }): Promise<GuidesItems[]> => {
      const whereConditions: Record<string, any>[] = [];

      if (input.conditions?.length) {
        whereConditions.push({
          "conditions.slug": { in: input.conditions },
        });
      }

      if (input.themes?.length) {
        whereConditions.push({
          "theme.slug": { in: input.themes },
        });
      }

      if (input.personas?.length) {
        whereConditions.push({
          "persona.slug": { in: input.personas },
        });
      }

      const trimmedText = input.text?.trim();

      if (trimmedText) {
        whereConditions.push({
          or: [
            { title: { contains: trimmedText } },
            { description: { contains: trimmedText } },
            { html: { contains: trimmedText } },
          ],
        });
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
        where: whereConditions.length ? { and: whereConditions } : undefined,
      });

      return mappingResults(result.docs as PracticalGuidePayload[]);
    }),
});
