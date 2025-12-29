import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";

const payload = await getPayload({ config: payloadConfig });

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";

export const conditionRouter = createTRPCRouter({
  all: publicProcedure.query(async () => {
    const result = await payload.find({
      collection: "conditions",
      select: {
        updatedAt: false,
        createdAt: false,
      },
    });

    const res = result.docs.map(
      (condition): PersonaTile => ({
        ...condition,
        display: "condition",
      })
    );
    return res;
  }),
});
