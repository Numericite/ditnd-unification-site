import { useEffect, useMemo, useState } from "react";
import {
	default as MapGL,
	Marker,
	NavigationControl,
	Popup,
	type MapRef,
	type StyleSpecification,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import { dsfrAccentHex } from "~/utils/dsfr-color-hex";
import type {
	MapCategorySummary,
	MapMarkerSummary,
	MapPayload,
} from "~/server/api/routers/maps";

const osmStyle: StyleSpecification = {
	version: 8,
	sources: {
		osm: {
			type: "raster",
			tiles: [
				"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
				"https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
				"https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
			],
			tileSize: 256,
			attribution:
				'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
			maxzoom: 19,
		},
	},
	layers: [{ id: "osm", type: "raster", source: "osm" }],
};

const FRANCE_CENTER = { latitude: 46.6, longitude: 2.3, zoom: 5 };

type Props = {
	map: MapPayload;
	height: number;
};

export default function MapDisplay({ map, height }: Props) {
	const { classes } = useStyles();
	const [selectedMarker, setSelectedMarker] = useState<MapMarkerSummary | null>(
		null,
	);
	const [mapRef, setMapRef] = useState<MapRef | null>(null);

	const categoryById = useMemo(() => {
		const lookup = new Map<number, MapCategorySummary>();
		for (const cat of map.categories) lookup.set(cat.id, cat);
		return lookup;
	}, [map.categories]);

	const initialView = useMemo(() => {
		return {
			latitude: map.defaultLatitude ?? FRANCE_CENTER.latitude,
			longitude: map.defaultLongitude ?? FRANCE_CENTER.longitude,
			zoom: map.defaultZoom ?? FRANCE_CENTER.zoom,
		};
	}, [map.defaultLatitude, map.defaultLongitude, map.defaultZoom]);

	useEffect(() => {
		if (!mapRef) return;
		if (!map.fitToMarkers) return;
		if (map.markers.length === 0) return;

		const lngs = map.markers.map((m) => m.longitude as number);
		const lats = map.markers.map((m) => m.latitude as number);
		const bounds: [[number, number], [number, number]] = [
			[Math.min(...lngs), Math.min(...lats)],
			[Math.max(...lngs), Math.max(...lats)],
		];
		mapRef.fitBounds(bounds, { padding: 48, maxZoom: 13, duration: 0 });
	}, [mapRef, map.fitToMarkers, map.markers]);

	const categoriesWithMarkers = useMemo(
		() =>
			map.categories.filter((cat) =>
				map.markers.some((m) => m.categoryId === cat.id),
			),
		[map.categories, map.markers],
	);

	return (
		<figure className={`${fr.cx("fr-my-3v")} ${classes.figure}`}>
			{map.title ? (
				<figcaption className={classes.caption}>{map.title}</figcaption>
			) : null}
			<div className={classes.wrapper} style={{ height }}>
				<MapGL
					ref={setMapRef}
					initialViewState={initialView}
					mapStyle={osmStyle}
					attributionControl={{ compact: true }}
				>
					<NavigationControl position="top-right" showCompass={false} />
					{map.markers.map((marker) => {
						const category = categoryById.get(marker.categoryId);
						const color = dsfrAccentHex(category?.colorVariant);
						return (
							<Marker
								key={marker.id}
								longitude={marker.longitude as number}
								latitude={marker.latitude as number}
								anchor="bottom"
								onClick={(e) => {
									e.originalEvent.stopPropagation();
									setSelectedMarker(marker);
								}}
							>
								<button
									type="button"
									aria-label={`${marker.name}${category ? ` — ${category.name}` : ""}`}
									className={classes.pin}
									style={{ color }}
								>
									<svg
										width="28"
										height="36"
										viewBox="0 0 24 32"
										aria-hidden="true"
									>
										<title>{marker.name}</title>
										<path
											fill="currentColor"
											stroke="#ffffff"
											strokeWidth="1.5"
											d="M12 1c5.5 0 10 4.3 10 9.6 0 7.4-10 20.4-10 20.4S2 18 2 10.6C2 5.3 6.5 1 12 1z"
										/>
										<circle cx="12" cy="10" r="3.2" fill="#ffffff" />
									</svg>
								</button>
							</Marker>
						);
					})}
					{selectedMarker ? (
						<Popup
							longitude={selectedMarker.longitude as number}
							latitude={selectedMarker.latitude as number}
							anchor="bottom"
							offset={36}
							onClose={() => setSelectedMarker(null)}
							closeOnClick={false}
							className={classes.popup}
						>
							<div className={classes.popupBody}>
								<p className={classes.popupTitle}>{selectedMarker.name}</p>
								{selectedMarker.address || selectedMarker.city ? (
									<p className={classes.popupLine}>
										{[
											selectedMarker.address,
											selectedMarker.postalCode,
											selectedMarker.city,
										]
											.filter(Boolean)
											.join(", ")}
									</p>
								) : null}
								{selectedMarker.description ? (
									<p className={classes.popupLine}>
										{selectedMarker.description}
									</p>
								) : null}
								{selectedMarker.phone ? (
									<p className={classes.popupLine}>
										<a href={`tel:${selectedMarker.phone}`}>
											{selectedMarker.phone}
										</a>
									</p>
								) : null}
								{selectedMarker.website ? (
									<p className={classes.popupLine}>
										<a
											href={selectedMarker.website}
											target="_blank"
											rel="noopener noreferrer"
										>
											Site web
										</a>
									</p>
								) : null}
							</div>
						</Popup>
					) : null}
				</MapGL>
			</div>
			{categoriesWithMarkers.length > 1 ? (
				<ul className={classes.legend} aria-label="Légende">
					{categoriesWithMarkers.map((cat) => (
						<li key={cat.id} className={classes.legendItem}>
							<span
								aria-hidden="true"
								className={classes.legendDot}
								style={{ backgroundColor: dsfrAccentHex(cat.colorVariant) }}
							/>
							<span>{cat.name}</span>
						</li>
					))}
				</ul>
			) : null}
		</figure>
	);
}

const useStyles = tss.withName(MapDisplay.name).create(() => ({
	figure: {
		margin: 0,
	},
	caption: {
		fontWeight: 700,
		marginBottom: "0.5rem",
	},
	wrapper: {
		width: "100%",
		borderRadius: "0.25rem",
		overflow: "hidden",
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
	},
	pin: {
		all: "unset",
		cursor: "pointer",
		display: "block",
		lineHeight: 0,
		"&:focus-visible svg": {
			outline: `2px solid ${fr.colors.decisions.border.plain.info.default}`,
			outlineOffset: "2px",
			borderRadius: "2px",
		},
	},
	popup: {
		"& .maplibregl-popup-content": {
			padding: "0.75rem 1rem",
			borderRadius: "0.25rem",
		},
	},
	popupBody: {
		minWidth: "180px",
		maxWidth: "260px",
	},
	popupTitle: {
		fontWeight: 700,
		margin: 0,
		marginBottom: "0.25rem",
	},
	popupLine: {
		margin: 0,
		fontSize: "0.875rem",
		lineHeight: 1.4,
		marginTop: "0.125rem",
	},
	legend: {
		listStyle: "none",
		padding: 0,
		margin: "0.5rem 0 0",
		display: "flex",
		flexWrap: "wrap",
		gap: "0.5rem 1rem",
	},
	legendItem: {
		display: "inline-flex",
		alignItems: "center",
		gap: "0.5rem",
		fontSize: "0.875rem",
	},
	legendDot: {
		display: "inline-block",
		width: "0.75rem",
		height: "0.75rem",
		borderRadius: "50%",
		border: "1.5px solid #ffffff",
		boxShadow: `0 0 0 1px ${fr.colors.decisions.border.default.grey.default}`,
	},
}));
