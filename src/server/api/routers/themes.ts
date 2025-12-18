import { z } from "zod";
import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";

const payload = await getPayload({ config: payloadConfig });

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const themeRouter = createTRPCRouter({
  all: publicProcedure.query(async () => {
    const result = await payload.find({
      collection: "themes",
      select: {
        updatedAt: false,
        createdAt: false,
      },
    });

    return result.docs;
  }),
});
