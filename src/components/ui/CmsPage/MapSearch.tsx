import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar/SearchBar";
import { tss } from "tss-react/dsfr";
import { dsfrAccentHex } from "~/utils/dsfr-color-hex";
import { normalizeForSearch } from "~/utils/tools";
import type {
	MapCategorySummary,
	MapMarkerSummary,
} from "~/server/api/routers/maps";

type Props = {
	markers: MapMarkerSummary[];
	categoryById: Map<number, MapCategorySummary>;
	onSelect: (marker: MapMarkerSummary) => void;
	onGeoSearch: (lat: number, lng: number, zoom: number) => void;
};

type GeoKind = "municipality" | "department" | "region";

type GeoResult = {
	id: string;
	label: string;
	context: string | null;
	kind: GeoKind;
	latitude: number;
	longitude: number;
};

const GEOCODE_ENDPOINT = "https://data.geopf.fr/geocodage/search/";
const GEO_MIN_QUERY_LENGTH = 3;
const GEO_MAX_RESULTS = 5;
const GEO_DEBOUNCE_MS = 300;

const GEO_KIND_LABEL: Record<GeoKind, string> = {
	municipality: "Commune",
	department: "Département",
	region: "Région",
};

const GEO_KIND_ZOOM: Record<GeoKind, number> = {
	municipality: 12,
	department: 9,
	region: 8,
};

function parseGeoFeatures(features: unknown[]): GeoResult[] {
	const results: GeoResult[] = [];
	for (const feature of features as Array<{
		geometry?: { coordinates?: [number, number] };
		properties?: Record<string, any>;
	}>) {
		const coords = feature.geometry?.coordinates;
		const props = feature.properties;
		if (!coords || !props) continue;
		const [longitude, latitude] = coords;

		if (props._type === "poi") {
			const categories: string[] = Array.isArray(props.category)
				? props.category
				: [];
			const kind: GeoKind | null = categories.includes("région")
				? "region"
				: categories.includes("département")
					? "department"
					: null;
			if (!kind || typeof props.toponym !== "string") continue;
			results.push({
				id: String(props.extrafields?.cleabs ?? `${longitude},${latitude}`),
				label: props.toponym,
				context: null,
				kind,
				latitude,
				longitude,
			});
		} else if (props.type === "municipality") {
			const label = props.name ?? props.label;
			if (typeof label !== "string" || label.includes("Arrondissement"))
				continue;
			results.push({
				id: String(props.id ?? `${longitude},${latitude}`),
				label,
				context: typeof props.context === "string" ? props.context : null,
				kind: "municipality",
				latitude,
				longitude,
			});
		}
	}
	return results.slice(0, GEO_MAX_RESULTS);
}

export default function MapSearch({
	markers,
	categoryById,
	onSelect,
	onGeoSearch,
}: Props) {
	const { classes, cx } = useStyles();
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
	const [isGeoLoading, setIsGeoLoading] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const markerResults = useMemo(() => {
		const q = normalizeForSearch(query.trim());
		if (q.length < 2) return [];
		return markers
			.filter(
				(m) =>
					normalizeForSearch(m.name).includes(q) ||
					(m.city ? normalizeForSearch(m.city).includes(q) : false) ||
					m.postalCode?.includes(q),
			)
			.slice(0, 8);
	}, [markers, query]);

	useEffect(() => {
		const q = query.trim();
		if (q.length < GEO_MIN_QUERY_LENGTH) {
			setGeoResults([]);
			setIsGeoLoading(false);
			return;
		}
		setIsGeoLoading(true);
		const controller = new AbortController();
		const timer = setTimeout(async () => {
			try {
				const params = new URLSearchParams({
					q,
					index: "poi,address",
					type: "municipality",
					category: "département,région",
					limit: "10",
				});
				const res = await fetch(`${GEOCODE_ENDPOINT}?${params.toString()}`, {
					signal: controller.signal,
				});
				if (!res.ok) {
					setGeoResults([]);
					return;
				}
				const data = await res.json();
				setGeoResults(parseGeoFeatures(data.features ?? []));
			} catch {
				// aborted or network error: keep previous results
			} finally {
				if (!controller.signal.aborted) setIsGeoLoading(false);
			}
		}, GEO_DEBOUNCE_MS);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [query]);

	const totalResults = markerResults.length + geoResults.length;

	const closeDropdown = useCallback(() => {
		setQuery("");
		setIsOpen(false);
		setActiveIndex(-1);
		setGeoResults([]);
	}, []);

	const handleSelect = useCallback(
		(marker: MapMarkerSummary) => {
			closeDropdown();
			onSelect(marker);
		},
		[closeDropdown, onSelect],
	);

	const handleGeoSelect = useCallback(
		(geo: GeoResult) => {
			closeDropdown();
			onGeoSearch(geo.latitude, geo.longitude, GEO_KIND_ZOOM[geo.kind]);
		},
		[closeDropdown, onGeoSearch],
	);

	const selectIndex = useCallback(
		(index: number) => {
			if (index < markerResults.length) {
				const marker = markerResults[index];
				if (marker) handleSelect(marker);
			} else {
				const geo = geoResults[index - markerResults.length];
				if (geo) handleGeoSelect(geo);
			}
		},
		[markerResults, geoResults, handleSelect, handleGeoSelect],
	);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setIsOpen(true);
			setActiveIndex((prev) => (prev + 1) % Math.max(totalResults, 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex(
				(prev) => (prev - 1 + totalResults) % Math.max(totalResults, 1),
			);
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (totalResults > 0) selectIndex(activeIndex >= 0 ? activeIndex : 0);
		} else if (e.key === "Escape") {
			setIsOpen(false);
			setActiveIndex(-1);
			inputRef.current?.blur();
		}
	};

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
				setActiveIndex(-1);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const showNoResults =
		isOpen && query.trim().length >= 2 && totalResults === 0 && !isGeoLoading;
	const showDropdown = isOpen && totalResults > 0;

	return (
		<div ref={containerRef} className={classes.container}>
			<SearchBar
				label="Rechercher"
				className={classes.searchBar}
				renderInput={({ id, type, className, placeholder }) => (
					<input
						ref={inputRef}
						id={id}
						type={type}
						className={className}
						placeholder={placeholder}
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setIsOpen(true);
							setActiveIndex(-1);
						}}
						onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
						onKeyDown={handleKeyDown}
						autoComplete="off"
					/>
				)}
				onButtonClick={() => {
					if (totalResults > 0) selectIndex(activeIndex >= 0 ? activeIndex : 0);
				}}
			/>

			{showDropdown ? (
				<ul className={classes.dropdown}>
					{markerResults.length > 0 ? (
						<li aria-hidden="true" className={classes.groupLabel}>
							Sur la carte
						</li>
					) : null}
					{markerResults.map((marker, i) => {
						const category = categoryById.get(marker.categoryId);
						const color = dsfrAccentHex(category?.colorVariant);
						return (
							<li key={marker.id}>
								<Button
									priority="tertiary no outline"
									className={cx(
										classes.result,
										activeIndex === i && classes.resultActive,
									)}
									onClick={() => handleSelect(marker)}
									nativeButtonProps={{
										onMouseEnter: () => setActiveIndex(i),
									}}
								>
									<i
										aria-hidden="true"
										className={fr.cx("fr-icon-map-pin-2-fill")}
										style={{ color, flexShrink: 0 }}
									/>
									<span className={classes.resultText}>
										<span className={classes.resultName}>{marker.name}</span>
										{marker.city ? (
											<span className={classes.resultCity}>
												{[marker.postalCode, marker.city]
													.filter(Boolean)
													.join(" ")}
											</span>
										) : null}
									</span>
								</Button>
							</li>
						);
					})}

					{geoResults.length > 0 ? (
						<li aria-hidden="true" className={classes.groupLabel}>
							Lieux en France
						</li>
					) : null}
					{geoResults.map((geo, i) => {
						const index = markerResults.length + i;
						return (
							<li key={geo.id}>
								<Button
									priority="tertiary no outline"
									className={cx(
										classes.result,
										activeIndex === index && classes.resultActive,
									)}
									onClick={() => handleGeoSelect(geo)}
									nativeButtonProps={{
										onMouseEnter: () => setActiveIndex(index),
									}}
								>
									<i
										aria-hidden="true"
										className={cx(
											fr.cx("fr-icon-map-pin-2-line"),
											classes.geoIcon,
										)}
										style={{ flexShrink: 0 }}
									/>
									<span className={classes.resultText}>
										<span className={classes.resultName}>
											{geo.label}
											<span className={classes.kindTag}>
												{GEO_KIND_LABEL[geo.kind]}
											</span>
										</span>
										{geo.context ? (
											<span className={classes.resultCity}>{geo.context}</span>
										) : null}
									</span>
								</Button>
							</li>
						);
					})}
				</ul>
			) : null}

			{showNoResults ? (
				<div className={classes.noResults}>Aucun résultat</div>
			) : null}
		</div>
	);
}

const useStyles = tss.withName("MapSearch").create(() => ({
	container: {
		position: "relative",
		width: "100%",
	},
	searchBar: {
		boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
		marginBottom: "0 !important",
	},
	dropdown: {
		position: "absolute",
		top: "calc(100% + 0.25rem)",
		left: 0,
		right: 0,
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		borderRadius: "0.25rem",
		boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
		listStyle: "none",
		margin: 0,
		padding: `${fr.spacing("1v")} 0`,
		paddingLeft: "0 !important",
		zIndex: 40,
		maxHeight: "20rem",
		overflowY: "auto",
	},
	groupLabel: {
		padding: `${fr.spacing("2v")} ${fr.spacing("3v")} ${fr.spacing("1v")}`,
		fontSize: "0.6875rem",
		fontWeight: 700,
		textTransform: "uppercase",
		letterSpacing: "0.04em",
		color: fr.colors.decisions.text.mention.grey.default,
	},
	result: {
		display: "flex !important",
		alignItems: "center !important",
		gap: `${fr.spacing("2v")} !important`,
		width: "100% !important",
		padding: `${fr.spacing("2v")} ${fr.spacing("3v")} !important`,
		textAlign: "left",
		color: `${fr.colors.decisions.text.default.grey.default} !important`,
	},
	resultActive: {
		backgroundColor: `${fr.colors.decisions.background.alt.grey.default} !important`,
	},
	resultText: {
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	resultName: {
		fontSize: "0.875rem",
		fontWeight: 600,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	resultCity: {
		fontSize: "0.75rem",
		color: fr.colors.decisions.text.mention.grey.default,
	},
	geoIcon: {
		color: fr.colors.decisions.text.mention.grey.default,
	},
	kindTag: {
		display: "inline-block",
		marginLeft: fr.spacing("2v"),
		padding: `0 ${fr.spacing("1v")}`,
		borderRadius: "0.25rem",
		fontSize: "0.625rem",
		fontWeight: 700,
		textTransform: "uppercase",
		letterSpacing: "0.03em",
		verticalAlign: "middle",
		backgroundColor: fr.colors.decisions.background.contrast.info.default,
		color: fr.colors.decisions.text.default.info.default,
	},
	noResults: {
		position: "absolute",
		top: "calc(100% + 0.25rem)",
		left: 0,
		right: 0,
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		borderRadius: "0.25rem",
		padding: `${fr.spacing("2v")} ${fr.spacing("3v")}`,
		fontSize: "0.875rem",
		color: fr.colors.decisions.text.mention.grey.default,
		boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
	},
}));
