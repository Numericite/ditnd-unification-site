import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	default as MapGL,
	Marker,
	NavigationControl,
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
	const { classes, cx } = useStyles();
	const [selectedMarker, setSelectedMarker] = useState<MapMarkerSummary | null>(
		null,
	);
	const [mapRef, setMapRef] = useState<MapRef | null>(null);
	const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

	const categoryById = useMemo(() => {
		const lookup = new Map<number, MapCategorySummary>();
		for (const cat of map.categories) lookup.set(cat.id, cat);
		return lookup;
	}, [map.categories]);

	const initialView = useMemo(
		() => ({
			latitude: map.defaultLatitude ?? FRANCE_CENTER.latitude,
			longitude: map.defaultLongitude ?? FRANCE_CENTER.longitude,
			zoom: map.defaultZoom ?? FRANCE_CENTER.zoom,
		}),
		[map.defaultLatitude, map.defaultLongitude, map.defaultZoom],
	);

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

	useEffect(() => {
		if (!selectedMarker) return;
		const el = itemRefs.current.get(selectedMarker.id);
		if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
	}, [selectedMarker]);

	const handleSelectFromMap = useCallback((marker: MapMarkerSummary) => {
		setSelectedMarker((prev) => (prev?.id === marker.id ? null : marker));
	}, []);

	const handleSelectFromSidebar = useCallback(
		(marker: MapMarkerSummary) => {
			setSelectedMarker((prev) => (prev?.id === marker.id ? null : marker));
			if (
				mapRef &&
				marker.latitude !== null &&
				marker.latitude !== undefined &&
				marker.longitude !== null &&
				marker.longitude !== undefined
			) {
				mapRef.flyTo({
					center: [marker.longitude as number, marker.latitude as number],
					zoom: Math.max(mapRef.getZoom(), 10),
					duration: 800,
				});
			}
		},
		[mapRef],
	);

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

			<div className={classes.splitContainer} style={{ height }}>
				<div className={classes.sidebar}>
					<ul className={classes.markerList}>
						{map.markers.map((marker) => {
							const category = categoryById.get(marker.categoryId);
							const color = dsfrAccentHex(category?.colorVariant);
							const isSelected = selectedMarker?.id === marker.id;
							return (
								<li key={marker.id} className={classes.markerListItem}>
									<button
										ref={(el) => {
											if (el) itemRefs.current.set(marker.id, el);
											else itemRefs.current.delete(marker.id);
										}}
										type="button"
										className={cx(
											classes.markerItemBtn,
											isSelected && classes.markerItemBtnSelected,
										)}
										onClick={() => handleSelectFromSidebar(marker)}
										aria-expanded={isSelected}
										aria-pressed={isSelected}
									>
										<span
											className={classes.markerDot}
											aria-hidden="true"
											style={{ backgroundColor: color }}
										/>
										<span className={classes.markerInfo}>
											<span className={classes.markerName}>{marker.name}</span>
											{marker.city ? (
												<span className={classes.markerCity}>
													{[marker.postalCode, marker.city]
														.filter(Boolean)
														.join(" ")}
												</span>
											) : null}
										</span>
									</button>

									<div
										className={cx(
											classes.markerDetailsWrapper,
											isSelected && classes.markerDetailsOpen,
										)}
										aria-hidden={!isSelected}
									>
										<div className={classes.markerDetailsInner}>
											{marker.description ? (
												<p className={classes.markerDetailLine}>
													{marker.description}
												</p>
											) : null}
											{marker.phone ? (
												<p className={classes.markerDetailLine}>
													<a href={`tel:${marker.phone}`}>{marker.phone}</a>
												</p>
											) : null}
											{marker.website ? (
												<p className={classes.markerDetailLine}>
													<a
														href={marker.website}
														target="_blank"
														rel="noopener noreferrer"
													>
														Site web <span aria-hidden="true">↗</span>
													</a>
												</p>
											) : null}
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>

				<div className={classes.mapArea}>
					<MapGL
						ref={setMapRef}
						initialViewState={initialView}
						mapStyle={osmStyle}
						attributionControl={{ compact: true }}
						onClick={() => setSelectedMarker(null)}
					>
						<NavigationControl position="top-right" showCompass={false} />
						{map.markers.map((marker) => {
							const category = categoryById.get(marker.categoryId);
							const color = dsfrAccentHex(category?.colorVariant);
							const isSelected = selectedMarker?.id === marker.id;
							return (
								<Marker
									key={marker.id}
									longitude={marker.longitude as number}
									latitude={marker.latitude as number}
									anchor="bottom"
									style={{ zIndex: isSelected ? 10 : 1 }}
									onClick={(e) => {
										e.originalEvent.stopPropagation();
										handleSelectFromMap(marker);
									}}
								>
									<button
										type="button"
										aria-label={`${marker.name}${category ? ` — ${category.name}` : ""}`}
										aria-pressed={isSelected}
										className={cx(
											classes.pin,
											isSelected && classes.pinSelected,
										)}
										style={{ color }}
									>
										<svg
											width="28"
											height="36"
											viewBox="0 0 24 32"
											aria-hidden="true"
										>
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
					</MapGL>
				</div>
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
		color: fr.colors.decisions.text.title.grey.default,
	},

	splitContainer: {
		display: "flex",
		width: "100%",
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		borderRadius: "0.25rem",
		overflow: "hidden",
	},
	sidebar: {
		width: "25%",
		flexShrink: 0,
		overflowY: "auto",
		borderRight: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		backgroundColor: fr.colors.decisions.background.default.grey.default,
	},
	mapArea: {
		flex: 1,
		minWidth: 0,
		height: "100%",
	},

	markerList: {
		listStyle: "none",
		margin: 0,
		padding: "0 !important",
	},
	markerListItem: {
		display: "flex",
		flexDirection: "column",
		gap: 0,
	},
	markerItemBtn: {
		all: "unset",
		display: "flex",
		alignItems: "flex-start",
		gap: "0.625rem",
		width: "100%",
		padding: "0.75rem 1rem",
		cursor: "pointer",
		color: fr.colors.decisions.text.default.grey.default,
		transition: "background-color 0.15s ease, border-color 0.15s ease",
		"&:hover": {
			backgroundColor: `${fr.colors.decisions.background.alt.grey.default} !important`,
		},
	},
	markerItemBtnSelected: {
		backgroundColor: fr.colors.decisions.background.alt.grey.default,
	},
	markerDot: {
		flexShrink: 0,
		marginTop: "0.25rem",
		display: "inline-block",
		width: "0.625rem",
		height: "0.625rem",
		borderRadius: "50%",
	},
	markerInfo: {
		display: "flex",
		flexDirection: "column",
		gap: "0.125rem",
		minWidth: 0,
	},
	markerName: {
		fontWeight: 600,
		fontSize: "0.875rem",
		color: fr.colors.decisions.text.label.grey.default,
		lineHeight: 1.3,
	},
	markerCity: {
		fontSize: "0.75rem",
		color: fr.colors.decisions.text.mention.grey.default,
		lineHeight: 1.3,
	},

	markerDetailsWrapper: {
		maxHeight: "0px",
		overflow: "hidden",
		transition: "max-height 0.3s ease",
	},
	markerDetailsOpen: {
		maxHeight: "300px",
	},
	markerDetailsInner: {
		padding: "0.5rem 1rem 0.75rem calc(1rem + 0.625rem + 0.625rem)",
		backgroundColor: fr.colors.decisions.background.alt.grey.default,
	},
	markerDetailLine: {
		margin: 0,
		marginTop: "0.375rem",
		fontSize: "0.8125rem",
		lineHeight: 1.45,
		color: fr.colors.decisions.text.default.grey.default,
	},

	pin: {
		all: "unset",
		cursor: "pointer",
		display: "block",
		lineHeight: 0,
		transition: "transform 0.15s ease, filter 0.15s ease",
		transformOrigin: "bottom center",
		"&:hover": {
			backgroundColor: "transparent !important",
		},
		"&:focus-visible svg": {
			outline: `2px solid ${fr.colors.decisions.border.plain.info.default}`,
			outlineOffset: "2px",
			borderRadius: "2px",
		},
	},
	pinSelected: {
		transform: "scale(1.35)",
		filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))",
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
