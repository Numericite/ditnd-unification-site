import { getPayload } from "payload";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import payloadConfig from "~/payload/payload.config";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const payload = await getPayload({ config: payloadConfig });

export const personaRouter = createTRPCRouter({
  professionals: publicProcedure.query(async () => {
    const result = await payload.find({
      collection: "personas",
      where: {
        slug: {
          like: "pro%",
        },
      },
      select: {
        updatedAt: false,
        createdAt: false,
      },
    });
    const res = result.docs.map(
      (persona): PersonaTile => ({
        ...persona,
        display: "afterProfessionnal",
      })
    );
    return res;
  }),
});
