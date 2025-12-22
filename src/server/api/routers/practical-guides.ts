import { z } from "zod";
import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";

const payload = await getPayload({ config: payloadConfig });

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const practicalGuidesRouter = createTRPCRouter({
  display: publicProcedure.query(async () => {
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
      condition: doc.conditions?.[0] ?? null,
      persona: doc.persona?.[0] ?? null,
      theme: doc.theme?.[0] ?? null,
    }));
  }),
});
