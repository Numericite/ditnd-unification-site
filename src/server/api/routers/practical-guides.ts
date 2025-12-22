import { z } from "zod";
import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";

const payload = await getPayload({ config: payloadConfig });

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { GuidesItems } from "~/components/PracticalGuides/PracticalGuidesDisplay";

function getFirstRelation<T>(value: unknown): T | undefined {
  if (!Array.isArray(value)) return undefined;

  const first = value[0];
  return typeof first === "object" && first !== null ? (first as T) : undefined;
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
});
