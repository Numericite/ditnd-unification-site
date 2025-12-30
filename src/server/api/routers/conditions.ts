import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { TDH } from "~/state/store";

const payload = await getPayload({ config: payloadConfig });

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
      (condition): TDH => ({
        ...condition,
        display: "condition",
      })
    );
    return res;
  }),
});
