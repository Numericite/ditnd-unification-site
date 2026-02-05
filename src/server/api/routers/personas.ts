import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const personaRouter = createTRPCRouter({
	all: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.payload.find({
			collection: "personas",
			limit: 0,
			select: {
				updatedAt: false,
				createdAt: false,
			},
		});
		return result.docs;
	}),

	professionals: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.payload.find({
			collection: "personas",
			limit: 0,
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
				display: "afterProfessional",
			}),
		);
		return res;
	}),

	persons: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.payload.find({
			collection: "personas",
			limit: 0,
			where: {
				slug: {
					not_like: "pro%",
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
				display: "person",
			}),
		);
		return res;
	}),
});
