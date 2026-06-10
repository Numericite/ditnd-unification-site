import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type {
	Map as MapDoc,
	MapCategory,
	MapMarker,
} from "~/payload/payload-types";
import { type BasemapKey, DEFAULT_BASEMAP } from "~/utils/map-basemaps";
import { geocodeAddress } from "~/payload/lib/geocode";

export type CustomFieldDef = {
	id?: string | null;
	label: string;
	key: string;
	type: "checkbox" | "text" | "select";
	options?: Array<{ id?: string | null; label: string; value: string }> | null;
};

export type MapCategorySummary = Pick<
	MapCategory,
	"id" | "name" | "slug" | "colorVariant" | "iconId"
> & {
	customFields: CustomFieldDef[];
};

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
	metadata: Record<string, unknown> | null;
};

export type AllowedFilters = {
	region: boolean;
	departement: boolean;
	category: boolean;
};

export type AllowedCustomFieldFilter = {
	categoryId: number;
	key: string;
	label: string;
	fieldType: "checkbox" | "select";
	options?: Array<{ label: string; value: string }>;
};

export type MapPayload = {
	id: number;
	slug: string;
	name: string;
	title: string | null;
	basemap: BasemapKey;
	description: string | null;
	defaultLatitude: number | null;
	defaultLongitude: number | null;
	defaultZoom: number | null;
	fitToMarkers: boolean;
	allowedFilters: AllowedFilters;
	allowedCustomFieldFilters: AllowedCustomFieldFilter[];
	categories: MapCategorySummary[];
	markers: MapMarkerSummary[];
};

const toSummary = (category: MapCategory): MapCategorySummary => ({
	id: category.id,
	name: category.name,
	slug: category.slug,
	colorVariant: category.colorVariant ?? null,
	iconId: category.iconId ?? null,
	customFields: category.customFields ?? [],
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
	metadata:
		marker.metadata !== null &&
		marker.metadata !== undefined &&
		typeof marker.metadata === "object" &&
		!Array.isArray(marker.metadata)
			? (marker.metadata as Record<string, unknown>)
			: null,
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

	// Géocoder les marqueurs sans coordonnées et persister le résultat
	const BATCH = 5;
	const docsToGeocode = markersResult.docs.filter(
		(m) => typeof m.latitude !== "number" || typeof m.longitude !== "number",
	);
	for (let i = 0; i < docsToGeocode.length; i += BATCH) {
		await Promise.all(
			docsToGeocode.slice(i, i + BATCH).map(async (m) => {
				const coords = await geocodeAddress(m.address, m.postalCode, m.city);
				if (!coords) return;
				m.latitude = coords.latitude;
				m.longitude = coords.longitude;
				await ctx.payload
					.update({
						collection: "map-markers",
						id: m.id,
						data: { latitude: coords.latitude, longitude: coords.longitude },
					})
					.catch((err) =>
						console.warn(
							`[maps] Failed to persist coords for marker ${m.id}:`,
							err,
						),
					);
			}),
		);
	}

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

	const doc = map as MapDoc & {
		allowFilterByCategory?: boolean | null;
		allowFilterByRegion?: boolean | null;
		allowFilterByDepartement?: boolean | null;
		allowedCustomFieldFilters?: unknown;
	};

	const rawCustomFilters = Array.isArray(doc.allowedCustomFieldFilters)
		? (doc.allowedCustomFieldFilters as Array<{
				categoryId: number;
				key: string;
			}>)
		: [];

	const allowedCustomFieldFilters: AllowedCustomFieldFilter[] = [];
	for (const { categoryId, key } of rawCustomFilters) {
		const cat = categoryDocs.find((c) => c.id === categoryId);
		if (!cat) continue;
		const fieldDef = cat.customFields?.find((f) => f.key === key);
		if (
			!fieldDef ||
			(fieldDef.type !== "checkbox" && fieldDef.type !== "select")
		)
			continue;
		const entry: AllowedCustomFieldFilter = {
			categoryId,
			key,
			label: fieldDef.label,
			fieldType: fieldDef.type,
		};
		if (fieldDef.type === "select") {
			entry.options = (fieldDef.options ?? []).map((o) => ({
				label: o.label,
				value: o.value,
			}));
		}
		allowedCustomFieldFilters.push(entry);
	}

	return {
		id: map.id,
		slug: map.slug,
		name: map.name,
		title: map.title ?? null,
		description: map.description ?? null,
		basemap: map.basemap ?? DEFAULT_BASEMAP,
		defaultLatitude: map.defaultLatitude ?? null,
		defaultLongitude: map.defaultLongitude ?? null,
		defaultZoom: map.defaultZoom ?? null,
		fitToMarkers: map.fitToMarkers ?? true,
		allowedCustomFieldFilters,
		allowedFilters: {
			category: doc.allowFilterByCategory ?? true,
			region: doc.allowFilterByRegion ?? true,
			departement: doc.allowFilterByDepartement ?? true,
		},
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
