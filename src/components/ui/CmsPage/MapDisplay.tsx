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
import { getMarkerGeo } from "~/utils/map-geo";
import MapFilterDrawer, {
	type ActiveFilters,
	type FilterOption,
} from "./MapFilterDrawer";
import ActiveFilterTags from "./ActiveFilterTags";
import type {
	CustomFieldDef,
	MapCategorySummary,
	MapMarkerSummary,
	MapPayload,
} from "~/server/api/routers/maps";
import Button from "@codegouvfr/react-dsfr/Button";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { Table } from "@codegouvfr/react-dsfr/Table";

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
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [viewMode, setViewMode] = useState<"map" | "table">("map");
	const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
		regions: [],
		departements: [],
		categories: [],
		customFields: {},
	});

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
									<a
										key="phone"
										href={`tel:${marker.phone}`}
										className={fr.cx("fr-link")}
										style={{ whiteSpace: "nowrap" }}
									>
										{marker.phone}
									</a>
								) : (
									"—"
								),
							]
						: []),
					...(hasWebsite
						? [
								marker.website ? (
									<a
										key="website"
										href={marker.website}
										target="_blank"
										rel="noopener noreferrer"
										className={fr.cx("fr-link")}
										style={{ whiteSpace: "nowrap" }}
									>
										Site web
									</a>
								) : (
									"—"
								),
							]
						: []),
				];
			}),
		[filteredMarkers, tableConfig, categoryById],
	);

	return (
		<figure className={`${fr.cx("fr-my-3v")} ${classes.figure}`}>
			{map.title ? (
				<figcaption className={classes.caption}>{map.title}</figcaption>
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
				<>
					<div className={classes.splitContainer} style={{ height }}>
						<div className={classes.sidebar}>
							<ul className={classes.markerList}>
								{filteredMarkers.map((marker) => {
									const category = categoryById.get(marker.categoryId);
									const color = dsfrAccentHex(category?.colorVariant);
									const isSelected = selectedMarker?.id === marker.id;
									return (
										<li key={marker.id} className={classes.markerListItem}>
											<Button
												ref={(el) => {
													if (el)
														itemRefs.current.set(
															marker.id,
															el as HTMLButtonElement,
														);
													else itemRefs.current.delete(marker.id);
												}}
												priority="tertiary no outline"
												className={cx(
													classes.markerItemBtn,
													isSelected && classes.markerItemBtnSelected,
												)}
												onClick={() => handleSelectFromSidebar(marker)}
												aria-expanded={isSelected}
												aria-controls={`marker-details-${marker.id}`}
											>
												<i
													aria-hidden="true"
													className={fr.cx("fr-icon-map-pin-2-fill")}
													style={{ color }}
												/>
												<span className={classes.markerInfo}>
													<span className={classes.markerName}>
														{marker.name}
													</span>
													{marker.city ? (
														<span className={classes.markerCity}>
															{[marker.postalCode, marker.city]
																.filter(Boolean)
																.join(" ")}
														</span>
													) : null}
												</span>
											</Button>

											<div
												id={`marker-details-${marker.id}`}
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
													{category?.customFields &&
													category.customFields.length > 0
														? category.customFields.map((f: CustomFieldDef) => {
																const raw = marker.metadata?.[f.key];
																if (raw === undefined || raw === null)
																	return null;
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
																	<p
																		key={f.key}
																		className={classes.markerDetailLine}
																	>
																		<span
																			style={{
																				fontWeight: 600,
																				color:
																					fr.colors.decisions.text.label.grey
																						.default,
																			}}
																		>
																			{f.label} :
																		</span>{" "}
																		{display}
																	</p>
																);
															})
														: null}
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
								{filteredMarkers.map((marker) => {
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
												className={cx(
													classes.pin,
													isSelected && classes.pinSelected,
												)}
												aria-label={`${marker.name}${category ? ` — ${category.name}` : ""}`}
												aria-pressed={isSelected}
												iconId="fr-icon-map-pin-2-fill"
												style={{ color }}
												title={marker.name}
											/>
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
									<i
										aria-hidden="true"
										className={fr.cx("fr-icon-map-pin-2-fill")}
										style={{ color: dsfrAccentHex(cat.colorVariant) }}
									/>
									<span>{cat.name}</span>
								</li>
							))}
						</ul>
					) : null}
				</>
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

	filterBadge: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		marginLeft: "0.375rem",
		width: "1.125rem",
		height: "1.125rem",
		borderRadius: "50%",
		backgroundColor:
			fr.colors.decisions.background.actionHigh.blueFrance.default,
		color: fr.colors.decisions.text.inverted.grey.default,
		fontSize: "0.6875rem",
		fontWeight: 700,
		lineHeight: 1,
	},
	resultCount: {
		fontSize: "0.75rem",
		color: fr.colors.decisions.text.mention.grey.default,
		whiteSpace: "nowrap",
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
		display: "flex !important",
		alignItems: "flex-start !important",
		gap: "0.625rem",
		width: "100% !important",
		minWidth: "0 !important",
		padding: `${fr.spacing("3v")} ${fr.spacing("4v")} !important`,
		boxSizing: "border-box",
		color: `${fr.colors.decisions.text.default.grey.default} !important`,
		transition: "background-color 0.15s ease !important",
		"&:hover": {
			backgroundColor: `${fr.colors.decisions.background.alt.grey.default} !important`,
			color: `${fr.colors.decisions.text.default.grey.default} !important`,
		},
	},
	markerItemBtnSelected: {
		backgroundColor: fr.colors.decisions.background.alt.grey.default,
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
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	markerCity: {
		textAlign: "start",
		fontSize: "0.75rem",
		color: fr.colors.decisions.text.mention.grey.default,
		lineHeight: 1.3,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
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

	legend: {
		listStyle: "none",
		padding: 0,
		margin: `${fr.spacing("2v")} 0 0`,
		display: "flex",
		flexWrap: "wrap",
		gap: `${fr.spacing("2v")} ${fr.spacing("4v")}`,
	},
	legendItem: {
		display: "inline-flex",
		alignItems: "center",
		gap: fr.spacing("2v"),
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
