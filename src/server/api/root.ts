import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { conditionRouter } from "./routers/conditions";
import { personaRouter } from "./routers/personas";
import { themeRouter } from "./routers/themes";
import { practicalGuidesRouter } from "./routers/practical-guides";
import { journeyRouter } from "./routers/journeys";
import { courseRouter } from "./routers/courses";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	condition: conditionRouter,
	persona: personaRouter,
	theme: themeRouter,
	course: courseRouter,
	practicalGuide: practicalGuidesRouter,
	journey: journeyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
