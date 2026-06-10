import type { StyleSpecification } from "react-map-gl/maplibre";

// Fonds de carte disponibles via la Géoplateforme IGN (WMTS, sans clé).
// La clé est stockée dans la collection « Cartes » et sert à construire le
// style MapLibre côté front.

export type BasemapKey = "plan-ign" | "aerial";

export type BasemapDef = {
	key: BasemapKey;
	label: string;
	layer: string;
	format: "image/png" | "image/jpeg";
	attribution: string;
	maxZoom: number;
};

const IGN_ATTRIBUTION =
	'© <a href="https://www.ign.fr" target="_blank" rel="noopener noreferrer">IGN</a> / Géoplateforme';

export const BASEMAPS: Record<BasemapKey, BasemapDef> = {
	"plan-ign": {
		key: "plan-ign",
		label: "Plan IGN",
		layer: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2",
		format: "image/png",
		attribution: IGN_ATTRIBUTION,
		maxZoom: 19,
	},
	aerial: {
		key: "aerial",
		label: "Photographies aériennes",
		layer: "ORTHOIMAGERY.ORTHOPHOTOS",
		format: "image/jpeg",
		attribution: IGN_ATTRIBUTION,
		maxZoom: 19,
	},
};

export const DEFAULT_BASEMAP: BasemapKey = "plan-ign";

export const BASEMAP_OPTIONS = Object.values(BASEMAPS).map((b) => ({
	label: b.label,
	value: b.key,
}));

export const resolveBasemap = (key: string | null | undefined): BasemapDef =>
	(key && BASEMAPS[key as BasemapKey]) || BASEMAPS[DEFAULT_BASEMAP];

export const buildBasemapStyle = (
	key: string | null | undefined,
): StyleSpecification => {
	const basemap = resolveBasemap(key);
	return {
		version: 8,
		sources: {
			basemap: {
				type: "raster",
				tiles: [
					"https://data.geopf.fr/wmts?" +
						"SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
						`&LAYER=${basemap.layer}` +
						`&STYLE=normal&TILEMATRIXSET=PM&FORMAT=${basemap.format}` +
						"&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
				],
				tileSize: 256,
				attribution: basemap.attribution,
				maxzoom: basemap.maxZoom,
			},
		},
		layers: [{ id: "basemap", type: "raster", source: "basemap" }],
	};
};
