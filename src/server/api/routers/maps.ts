import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type {
	Map as MapDoc,
	MapCategory,
	MapMarker,
} from "~/payload/payload-types";

export type MapCategorySummary = Pick<
	MapCategory,
	"id" | "name" | "slug" | "colorVariant" | "iconId"
>;

export type MapMarkerSummary = Pick<
	MapMarker,
	| "id"
	| "name"
	| "address"
	| "postalCode"
	| "city"
	| "latitude"
	| "longitude"
	| "phone"
	| "email"
	| "website"
	| "description"
> & {
	categoryId: number;
};

export type MapPayload = {
	id: number;
	slug: string;
	name: string;
	title: string | null;
	description: string | null;
	defaultLatitude: number | null;
	defaultLongitude: number | null;
	defaultZoom: number | null;
	fitToMarkers: boolean;
	categories: MapCategorySummary[];
	markers: MapMarkerSummary[];
};

const toSummary = (category: MapCategory): MapCategorySummary => ({
	id: category.id,
	name: category.name,
	slug: category.slug,
	colorVariant: category.colorVariant ?? null,
	iconId: category.iconId ?? null,
});

const toMarkerSummary = (
	marker: MapMarker,
	categoryId: number,
): MapMarkerSummary => ({
	id: marker.id,
	name: marker.name,
	address: marker.address ?? null,
	postalCode: marker.postalCode ?? null,
	city: marker.city ?? null,
	latitude: marker.latitude ?? null,
	longitude: marker.longitude ?? null,
	phone: marker.phone ?? null,
	email: marker.email ?? null,
	website: marker.website ?? null,
	description: marker.description ?? null,
	categoryId,
});

const buildPayload = async (
	ctx: { payload: import("payload").Payload },
	map: MapDoc,
): Promise<MapPayload> => {
	const categoryDocs: MapCategory[] = Array.isArray(map.categories)
		? map.categories
				.map((cat) => (typeof cat === "object" && cat !== null ? cat : null))
				.filter((cat): cat is MapCategory => cat !== null)
		: [];

	const categoryIds = categoryDocs.map((c) => c.id);

	const markersResult =
		categoryIds.length > 0
			? await ctx.payload.find({
					collection: "map-markers",
					limit: 0,
					depth: 0,
					where: { category: { in: categoryIds } },
				})
			: { docs: [] as MapMarker[] };

	const markers = markersResult.docs
		.map((m) => {
			const catId =
				typeof m.category === "number"
					? m.category
					: typeof m.category === "object" && m.category !== null
						? m.category.id
						: null;
			if (catId === null) return null;
			if (typeof m.latitude !== "number" || typeof m.longitude !== "number")
				return null;
			return toMarkerSummary(m, catId);
		})
		.filter((m): m is MapMarkerSummary => m !== null);

	return {
		id: map.id,
		slug: map.slug,
		name: map.name,
		title: map.title ?? null,
		description: map.description ?? null,
		defaultLatitude: map.defaultLatitude ?? null,
		defaultLongitude: map.defaultLongitude ?? null,
		defaultZoom: map.defaultZoom ?? null,
		fitToMarkers: map.fitToMarkers ?? true,
		categories: categoryDocs.map(toSummary),
		markers,
	};
};

export const mapsRouter = createTRPCRouter({
	byId: publicProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.query(async ({ input, ctx }): Promise<MapPayload | null> => {
			const map = await ctx.payload
				.findByID({
					collection: "maps",
					id: input.id,
					depth: 1,
				})
				.catch(() => null);
			if (!map) return null;
			return buildPayload(ctx, map as MapDoc);
		}),
	bySlug: publicProcedure
		.input(z.object({ slug: z.string().min(1) }))
		.query(async ({ input, ctx }): Promise<MapPayload | null> => {
			const result = await ctx.payload.find({
				collection: "maps",
				where: { slug: { equals: input.slug } },
				limit: 1,
				depth: 1,
			});
			const map = result.docs[0];
			if (!map) return null;
			return buildPayload(ctx, map as MapDoc);
		}),
});
