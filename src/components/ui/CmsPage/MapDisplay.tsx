import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
	default as MapGL,
	Marker,
	NavigationControl,
	Popup,
	type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Supercluster from "supercluster";
import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import { dsfrAccentHex } from "~/utils/dsfr-color-hex";
import MapClusterMarker from "./MapClusterMarker";
import { getMarkerGeo } from "~/utils/map-geo";
import { buildBasemapStyle } from "~/utils/map-basemaps";
import MapFilterDrawer, {
	type ActiveFilters,
	type FilterOption,
} from "./MapFilterDrawer";
import ActiveFilterTags from "./ActiveFilterTags";
import MapSearch from "./MapSearch";
import type {
	CustomFieldDef,
	MapCategorySummary,
	MapMarkerSummary,
	MapPayload,
} from "~/server/api/routers/maps";
import Button from "@codegouvfr/react-dsfr/Button";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { Table } from "@codegouvfr/react-dsfr/Table";

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
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [viewMode, setViewMode] = useState<"map" | "table">("map");
	const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
		regions: [],
		departements: [],
		categories: [],
		customFields: {},
	});

	const mapStyle = useMemo(() => buildBasemapStyle(map.basemap), [map.basemap]);

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

	const [viewport, setViewport] = useState<{
		bbox: [number, number, number, number];
		zoom: number;
	}>(() => ({
		bbox: [-180, -85, 180, 85],
		zoom: Math.round(initialView.zoom),
	}));

	const markerById = useMemo(() => {
		const lookup = new Map<number, MapMarkerSummary>();
		for (const m of map.markers) lookup.set(m.id, m);
		return lookup;
	}, [map.markers]);

	const flyToMarker = useCallback(
		(marker: MapMarkerSummary) => {
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
					padding: { top: 300, bottom: 40, left: 40, right: 40 },
				});
			}
		},
		[mapRef],
	);

	const handleSelectFromMap = useCallback(
		(marker: MapMarkerSummary) => {
			setSelectedMarker((prev) => (prev?.id === marker.id ? null : marker));
			flyToMarker(marker);
		},
		[flyToMarker],
	);

	const handleSearchSelect = useCallback(
		(marker: MapMarkerSummary) => {
			setSelectedMarker(marker);
			flyToMarker(marker);
		},
		[flyToMarker],
	);

	const handleGeoSearch = useCallback(
		(lat: number, lng: number, zoom: number) => {
			if (!mapRef) return;
			mapRef.flyTo({
				center: [lng, lat],
				zoom,
				duration: 800,
				padding: { top: 80, bottom: 40, left: 40, right: 40 },
			});
		},
		[mapRef],
	);

	const availableRegions = useMemo<FilterOption[]>(() => {
		const seen = new Map<string, string>();
		for (const m of map.markers) {
			const geo = getMarkerGeo(m.postalCode);
			if (geo && !seen.has(geo.region)) seen.set(geo.region, geo.region);
		}
		return Array.from(seen.entries())
			.map(([code, label]) => ({ code, label }))
			.sort((a, b) => a.label.localeCompare(b.label, "fr"));
	}, [map.markers]);

	const availableDepartements = useMemo<FilterOption[]>(() => {
		const seen = new Map<string, string>();
		for (const m of map.markers) {
			const geo = getMarkerGeo(m.postalCode);
			if (geo && !seen.has(geo.code))
				seen.set(geo.code, `${geo.code} — ${geo.name}`);
		}
		return Array.from(seen.entries())
			.map(([code, label]) => ({ code, label }))
			.sort((a, b) => a.code.localeCompare(b.code, "fr", { numeric: true }));
	}, [map.markers]);

	const availableCategories = useMemo(
		() =>
			map.categories.filter((cat) =>
				map.markers.some((m) => m.categoryId === cat.id),
			),
		[map.categories, map.markers],
	);

	const tableConfig = useMemo(() => {
		const hasPhone = map.markers.some((m) => m.phone);
		const hasWebsite = map.markers.some((m) => m.website);
		const showCategory = map.categories.length > 1;
		return { hasPhone, hasWebsite, showCategory };
	}, [map.markers, map.categories]);

	const tableHeaders = useMemo(
		() => [
			"Nom",
			...(tableConfig.showCategory ? ["Catégorie"] : []),
			"Ville",
			...(tableConfig.hasPhone ? ["Téléphone"] : []),
			...(tableConfig.hasWebsite ? ["Site web"] : []),
		],
		[tableConfig],
	);

	const filteredMarkers = useMemo(() => {
		return map.markers.filter((marker) => {
			if (
				activeFilters.categories.length > 0 &&
				!activeFilters.categories.includes(marker.categoryId)
			)
				return false;

			const geo = getMarkerGeo(marker.postalCode);

			if (activeFilters.departements.length > 0) {
				if (!geo || !activeFilters.departements.includes(geo.code))
					return false;
			}
			if (activeFilters.regions.length > 0) {
				if (!geo || !activeFilters.regions.includes(geo.region)) return false;
			}

			for (const [filterKey, selectedValues] of Object.entries(
				activeFilters.customFields,
			)) {
				if (selectedValues.length === 0) continue;
				const sep = filterKey.indexOf("::");
				const categoryId = Number(filterKey.slice(0, sep));
				const fieldKey = filterKey.slice(sep + 2);
				if (marker.categoryId !== categoryId) continue;
				const raw = marker.metadata?.[fieldKey];
				const strVal = raw == null ? null : String(raw);
				if (strVal === null || !selectedValues.includes(strVal)) return false;
			}

			return true;
		});
	}, [map.markers, activeFilters]);

	const clusterIndex = useMemo(() => {
		if (!map.enableClustering) return null;
		const index = new Supercluster<
			{ markerId: number; categoryId: number },
			{ counts: Record<string, number> }
		>({
			radius: 60,
			maxZoom: 16,
			map: (props) => ({ counts: { [props.categoryId]: 1 } }),
			reduce: (acc, props) => {
				const merged = { ...acc.counts };
				for (const [key, value] of Object.entries(props.counts)) {
					merged[key] = (merged[key] ?? 0) + value;
				}
				acc.counts = merged;
			},
		});
		index.load(
			filteredMarkers
				.filter((m) => m.longitude != null && m.latitude != null)
				.map((m) => ({
					type: "Feature" as const,
					properties: { markerId: m.id, categoryId: m.categoryId },
					geometry: {
						type: "Point" as const,
						coordinates: [m.longitude as number, m.latitude as number],
					},
				})),
		);
		return index;
	}, [filteredMarkers, map.enableClustering]);

	const clusters = useMemo(
		() =>
			clusterIndex
				? clusterIndex.getClusters(viewport.bbox, viewport.zoom)
				: [],
		[clusterIndex, viewport],
	);

	const updateViewport = useCallback(
		(instance: {
			getBounds: () => {
				getWest: () => number;
				getSouth: () => number;
				getEast: () => number;
				getNorth: () => number;
			};
			getZoom: () => number;
		}) => {
			const b = instance.getBounds();
			setViewport({
				bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
				zoom: Math.round(instance.getZoom()),
			});
		},
		[],
	);

	const handleClusterClick = useCallback(
		(clusterId: number, longitude: number, latitude: number) => {
			if (!clusterIndex || !mapRef) return;
			const zoom = Math.min(
				clusterIndex.getClusterExpansionZoom(clusterId),
				16,
			);
			mapRef.flyTo({ center: [longitude, latitude], zoom, duration: 600 });
		},
		[clusterIndex, mapRef],
	);

	const renderSingleMarker = useCallback(
		(marker: MapMarkerSummary) => {
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
					<Button
						className={cx(classes.pin, isSelected && classes.pinSelected)}
						aria-label={`${marker.name}${category ? ` — ${category.name}` : ""}`}
						aria-pressed={isSelected}
						iconId="fr-icon-map-pin-2-fill"
						style={{ color }}
						title={marker.name}
					/>
				</Marker>
			);
		},
		[categoryById, selectedMarker, handleSelectFromMap, classes, cx],
	);

	const activeFilterCount =
		activeFilters.regions.length +
		activeFilters.departements.length +
		activeFilters.categories.length +
		Object.values(activeFilters.customFields).reduce(
			(acc, vals) => acc + vals.length,
			0,
		);

	const hasFilters =
		map.allowedFilters.region ||
		map.allowedFilters.departement ||
		map.allowedFilters.category ||
		map.allowedCustomFieldFilters.length > 0;

	const categoriesWithMarkers = useMemo(
		() =>
			map.categories.filter((cat) =>
				map.markers.some((m) => m.categoryId === cat.id),
			),
		[map.categories, map.markers],
	);

	useEffect(() => {
		if (
			selectedMarker &&
			!filteredMarkers.some((m) => m.id === selectedMarker.id)
		) {
			setSelectedMarker(null);
		}
	}, [filteredMarkers, selectedMarker]);

	const handleRegionsChange = useCallback((codes: string[]) => {
		setActiveFilters((prev) => ({ ...prev, regions: codes }));
	}, []);

	const handleDepartementsChange = useCallback((codes: string[]) => {
		setActiveFilters((prev) => ({ ...prev, departements: codes }));
	}, []);

	const handleCategoriesChange = useCallback((ids: number[]) => {
		setActiveFilters((prev) => ({ ...prev, categories: ids }));
	}, []);

	const toggleCategory = useCallback(
		(id: number) => {
			setActiveFilters((prev) => {
				const allIds = categoriesWithMarkers.map((c) => c.id);
				const current = prev.categories.length === 0 ? allIds : prev.categories;
				const next = current.includes(id)
					? current.filter((x) => x !== id)
					: [...current, id];
				if (next.length === 0) return prev;
				return {
					...prev,
					categories: next.length === allIds.length ? [] : next,
				};
			});
		},
		[categoriesWithMarkers],
	);

	const handleCustomFieldChange = useCallback(
		(key: string, values: string[]) => {
			setActiveFilters((prev) => ({
				...prev,
				customFields: { ...prev.customFields, [key]: values },
			}));
		},
		[],
	);

	const handleResetFilters = useCallback(() => {
		setActiveFilters({
			regions: [],
			departements: [],
			categories: [],
			customFields: {},
		});
	}, []);

	const tableData = useMemo(
		() =>
			filteredMarkers.map((marker) => {
				const category = categoryById.get(marker.categoryId);
				const { hasPhone, hasWebsite, showCategory } = tableConfig;
				return [
					marker.name,
					...(showCategory ? [category?.name ?? "—"] : []),
					[marker.postalCode, marker.city].filter(Boolean).join(" ") || "—",
					...(hasPhone
						? [
								marker.phone ? (
									<Link
										key="phone"
										href={`tel:${marker.phone}`}
										className={fr.cx("fr-link")}
										style={{ whiteSpace: "nowrap" }}
										title={`Appeler : ${marker.name}`}
									>
										{marker.phone}
									</Link>
								) : (
									"—"
								),
							]
						: []),
					...(hasWebsite
						? [
								marker.website ? (
									<Link
										key="website"
										href={marker.website}
										target="_blank"
										rel="noopener noreferrer"
										className={fr.cx("fr-link")}
										style={{ whiteSpace: "nowrap" }}
										title={`Accéder au site web : ${marker.name}, nouvelle fenêtre`}
									>
										Accéder au site web
									</Link>
								) : (
									"—"
								),
							]
						: []),
				];
			}),
		[filteredMarkers, tableConfig, categoryById],
	);

	const popupCategory = selectedMarker
		? categoryById.get(selectedMarker.categoryId)
		: null;

	return (
		<figure className={`${fr.cx("fr-my-3v")} ${classes.figure}`}>
			{map.title ? (
				<figcaption className={classes.caption}>{map.title}</figcaption>
			) : null}

			{categoriesWithMarkers.length > 1 ? (
				<fieldset className={classes.legend}>
					<legend className={fr.cx("fr-sr-only")}>
						Afficher ou masquer les catégories
					</legend>
					{categoriesWithMarkers.map((cat) => {
						const isOn =
							activeFilters.categories.length === 0 ||
							activeFilters.categories.includes(cat.id);
						return (
							<button
								key={cat.id}
								type="button"
								className={cx(
									classes.legendItem,
									!isOn && classes.legendItemOff,
								)}
								aria-pressed={isOn}
								onClick={() => toggleCategory(cat.id)}
							>
								<i
									aria-hidden="true"
									className={fr.cx("fr-icon-map-pin-2-fill")}
									style={{ color: dsfrAccentHex(cat.colorVariant) }}
								/>
								<span>{cat.name}</span>
							</button>
						);
					})}
				</fieldset>
			) : null}

			<div className={classes.controls}>
				<SegmentedControl
					hideLegend
					legend="Mode d'affichage"
					segments={[
						{
							label: "Carte",
							iconId: "fr-icon-road-map-line",
							nativeInputProps: {
								name: "view-mode",
								checked: viewMode === "map",
								onChange: () => setViewMode("map"),
							},
						},
						{
							label: "Tableau",
							iconId: "fr-icon-table-line",
							nativeInputProps: {
								name: "view-mode",
								checked: viewMode === "table",
								onChange: () => setViewMode("table"),
							},
						},
					]}
				/>
				<div className={classes.controlsRight}>
					{hasFilters ? (
						<Button
							size="small"
							priority="tertiary"
							iconId="fr-icon-filter-line"
							onClick={() => setIsDrawerOpen(true)}
						>
							Filtres
							{activeFilterCount > 0 ? (
								<span className={classes.filterBadge}>{activeFilterCount}</span>
							) : null}
						</Button>
					) : null}
					<span className={classes.resultCount}>
						{filteredMarkers.length} / {map.markers.length}
					</span>
				</div>
			</div>

			{hasFilters && activeFilterCount > 0 ? (
				<ActiveFilterTags
					activeFilters={activeFilters}
					availableRegions={availableRegions}
					availableDepartements={availableDepartements}
					availableCategories={availableCategories}
					allowedCustomFieldFilters={map.allowedCustomFieldFilters}
					onRegionsChange={handleRegionsChange}
					onDepartementsChange={handleDepartementsChange}
					onCategoriesChange={handleCategoriesChange}
					onCustomFieldChange={handleCustomFieldChange}
				/>
			) : null}

			{viewMode === "map" ? (
				<div className={classes.mapWrapper}>
					<div className={classes.mapContainer} style={{ height }}>
						<MapGL
							ref={setMapRef}
							initialViewState={initialView}
							mapStyle={mapStyle}
							attributionControl={{ compact: true }}
							onClick={() => setSelectedMarker(null)}
							onMoveEnd={(e) => updateViewport(e.target)}
							onLoad={(e) => {
								if (map.fitToMarkers && map.markers.length > 0) {
									const lngs = map.markers.map((m) => m.longitude as number);
									const lats = map.markers.map((m) => m.latitude as number);
									e.target.fitBounds(
										[
											[Math.min(...lngs), Math.min(...lats)],
											[Math.max(...lngs), Math.max(...lats)],
										],
										{ padding: 48, maxZoom: 13, duration: 0 },
									);
								}
								updateViewport(e.target);
							}}
						>
							<NavigationControl position="top-right" showCompass={false} />

							{clusterIndex
								? clusters.map((feature) => {
										const [longitude, latitude] = feature.geometry
											.coordinates as [number, number];
										if ("cluster" in feature.properties) {
											const clusterId = feature.properties.cluster_id;
											const counts = feature.properties.counts;
											const total = feature.properties.point_count;
											return (
												<Marker
													key={`cluster-${clusterId}`}
													longitude={longitude}
													latitude={latitude}
													anchor="center"
												>
													<MapClusterMarker
														counts={counts}
														total={total}
														getColor={(id) =>
															dsfrAccentHex(categoryById.get(id)?.colorVariant)
														}
														getLabel={(id) => categoryById.get(id)?.name ?? ""}
														onClick={() =>
															handleClusterClick(clusterId, longitude, latitude)
														}
													/>
												</Marker>
											);
										}
										const marker = markerById.get(feature.properties.markerId);
										return marker ? renderSingleMarker(marker) : null;
									})
								: filteredMarkers.map(renderSingleMarker)}

							{selectedMarker && (
								<Popup
									longitude={selectedMarker.longitude as number}
									latitude={selectedMarker.latitude as number}
									anchor="bottom"
									offset={[0, -32]}
									closeButton={false}
									closeOnClick={false}
									onClose={() => setSelectedMarker(null)}
									className={classes.popup}
									maxWidth="20rem"
								>
									<div className={classes.popupInner}>
										<div className={classes.popupHeader}>
											<div className={classes.popupTitleGroup}>
												<strong className={classes.popupName}>
													{selectedMarker.name}
												</strong>
												{selectedMarker.city ? (
													<span className={classes.popupCity}>
														{[selectedMarker.postalCode, selectedMarker.city]
															.filter(Boolean)
															.join(" ")}
													</span>
												) : null}
											</div>
											<Button
												priority="tertiary no outline"
												iconId="fr-icon-close-line"
												size="small"
												onClick={() => setSelectedMarker(null)}
												title="Fermer"
											/>
										</div>

										{selectedMarker.description ? (
											<p className={classes.popupLine}>
												{selectedMarker.description}
											</p>
										) : null}

										{popupCategory?.customFields &&
										popupCategory.customFields.length > 0
											? popupCategory.customFields.map((f: CustomFieldDef) => {
													const raw = selectedMarker.metadata?.[f.key];
													if (raw === undefined || raw === null) return null;
													let display: string;
													if (f.type === "checkbox") {
														display = raw ? "Oui" : "Non";
													} else if (f.type === "select") {
														const opt = f.options?.find(
															(o) => o.value === String(raw),
														);
														display = opt ? opt.label : String(raw);
													} else {
														display = String(raw);
													}
													return (
														<p key={f.key} className={classes.popupLine}>
															<span className={classes.popupFieldLabel}>
																{f.label} :
															</span>{" "}
															{display}
														</p>
													);
												})
											: null}

										{selectedMarker.phone ? (
											<p className={classes.popupLine}>
												<Link
													href={`tel:${selectedMarker.phone}`}
													className={fr.cx("fr-link")}
													title={`Appeler : ${selectedMarker.name}`}
												>
													{selectedMarker.phone}
												</Link>
											</p>
										) : null}

										{selectedMarker.website ? (
											<p className={classes.popupLine}>
												<Link
													href={selectedMarker.website}
													target="_blank"
													rel="noopener noreferrer"
													className={fr.cx("fr-link")}
													title={`Accéder au site web : ${selectedMarker.name}, nouvelle fenêtre`}
												>
													Accéder au site web
												</Link>
											</p>
										) : null}
									</div>
								</Popup>
							)}
						</MapGL>
					</div>
					<div className={classes.searchOverlay}>
						<MapSearch
							markers={filteredMarkers}
							categoryById={categoryById}
							onSelect={handleSearchSelect}
							onGeoSearch={handleGeoSearch}
						/>
					</div>
				</div>
			) : (
				<div className={classes.tableContainer}>
					<Table
						caption={map.title ?? "Marqueurs de la carte"}
						headers={tableHeaders}
						data={tableData}
						noCaption={!!map.title}
					/>
				</div>
			)}

			{hasFilters ? (
				<MapFilterDrawer
					isOpen={isDrawerOpen}
					onClose={() => setIsDrawerOpen(false)}
					allowedFilters={map.allowedFilters}
					allowedCustomFieldFilters={map.allowedCustomFieldFilters}
					availableRegions={availableRegions}
					availableDepartements={availableDepartements}
					availableCategories={availableCategories}
					activeFilters={activeFilters}
					onRegionsChange={handleRegionsChange}
					onDepartementsChange={handleDepartementsChange}
					onCategoriesChange={handleCategoriesChange}
					onCustomFieldChange={handleCustomFieldChange}
					onReset={handleResetFilters}
					totalActive={activeFilterCount}
				/>
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
		marginBottom: fr.spacing("2v"),
		color: fr.colors.decisions.text.title.grey.default,
	},

	controls: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: fr.spacing("4v"),
		marginBottom: fr.spacing("3v"),
		flexWrap: "wrap",
	},
	controlsRight: {
		display: "flex",
		alignItems: "center",
		gap: fr.spacing("3v"),
		flexShrink: 0,
	},
	tableContainer: {
		overflowX: "auto",
		"& .fr-table": {
			margin: "0 !important",
		},
		"& .fr-table th, & .fr-table td": {
			whiteSpace: "nowrap",
			verticalAlign: "middle",
		},
	},

	mapWrapper: {
		position: "relative",
	},
	mapContainer: {
		width: "100%",
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		borderRadius: fr.spacing("1v"),
		overflow: "hidden",
	},
	searchOverlay: {
		position: "absolute",
		top: fr.spacing("3v"),
		left: fr.spacing("3v"),
		width: `min(17rem, calc(100% - ${fr.spacing("3v")} - ${fr.spacing("3v")} - ${fr.spacing("12v")}))`,
		zIndex: 30,
	},

	filterBadge: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		marginLeft: fr.spacing("1v"),
		width: fr.spacing("4v"),
		height: fr.spacing("4v"),
		borderRadius: "50%",
		backgroundColor:
			fr.colors.decisions.background.actionHigh.blueFrance.default,
		color: fr.colors.decisions.text.inverted.grey.default,
		fontSize: fr.spacing("3v"),
		fontWeight: 700,
		lineHeight: 1,
	},
	resultCount: {
		fontSize: fr.spacing("3v"),
		color: fr.colors.decisions.text.mention.grey.default,
		whiteSpace: "nowrap",
	},

	pin: {
		background: "transparent",
		"&:hover": {
			backgroundColor: "transparent !important",
		},
		"&:focus-visible svg": {
			outline: `2px solid ${fr.colors.decisions.border.plain.info.default}`,
			outlineOffset: "2px",
			borderRadius: "2px",
		},
		transition: "transform 0.15s ease, filter 0.15s ease",
		transformOrigin: "bottom center",
	},
	pinSelected: {
		transform: "scale(1.35)",
	},

	popup: {
		zIndex: 20,
		"& .maplibregl-popup-content": {
			padding: 0,
			borderRadius: fr.spacing("1v"),
			boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
			backgroundColor: fr.colors.decisions.background.default.grey.default,
			border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		},
		"& .maplibregl-popup-tip": {
			borderTopColor: `${fr.colors.decisions.border.default.grey.default} !important`,
		},
	},
	popupInner: {
		padding: `${fr.spacing("3v")} ${fr.spacing("3v")} ${fr.spacing("3v")} ${fr.spacing("4v")}`,
		maxWidth: "20rem",
	},
	popupHeader: {
		display: "flex",
		alignItems: "flex-start",
		justifyContent: "space-between",
		gap: fr.spacing("2v"),
		marginBottom: fr.spacing("1v"),
	},
	popupTitleGroup: {
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("1v"),
		minWidth: 0,
	},
	popupName: {
		fontSize: fr.spacing("4v"),
		fontWeight: 700,
		color: fr.colors.decisions.text.title.grey.default,
		lineHeight: 1.3,
	},
	popupCity: {
		fontSize: fr.spacing("3v"),
		color: fr.colors.decisions.text.mention.grey.default,
		lineHeight: 1.4,
	},
	popupLine: {
		margin: 0,
		marginTop: fr.spacing("2v"),
		fontSize: fr.spacing("3v"),
		lineHeight: 1.45,
		color: fr.colors.decisions.text.default.grey.default,
	},
	popupFieldLabel: {
		fontWeight: 600,
		color: fr.colors.decisions.text.label.grey.default,
	},

	legend: {
		display: "flex",
		flexWrap: "wrap",
		gap: fr.spacing("2v"),
		margin: `0 0 ${fr.spacing("3v")}`,
		padding: 0,
		border: 0,
		minInlineSize: 0,
	},
	legendItem: {
		display: "inline-flex",
		alignItems: "center",
		gap: fr.spacing("1v"),
		padding: `${fr.spacing("1v")} ${fr.spacing("3v")}`,
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		borderRadius: "9999px",
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		color: fr.colors.decisions.text.title.grey.default,
		fontSize: fr.spacing("3v"),
		lineHeight: 1.5,
		cursor: "pointer",
		transition: "background-color 0.15s ease, opacity 0.15s ease",
		"&:hover": {
			backgroundColor: `${fr.colors.decisions.background.contrast.grey.default} !important`,
		},
		"&:focus-visible": {
			outline: `2px solid ${fr.colors.decisions.border.plain.info.default}`,
			outlineOffset: "2px",
		},
	},
	legendItemOff: {
		opacity: 0.45,
		textDecoration: "line-through",
	},
}));
