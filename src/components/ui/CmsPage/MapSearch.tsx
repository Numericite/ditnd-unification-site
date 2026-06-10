import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar/SearchBar";
import { tss } from "tss-react/dsfr";
import { dsfrAccentHex } from "~/utils/dsfr-color-hex";
import type {
	MapCategorySummary,
	MapMarkerSummary,
} from "~/server/api/routers/maps";

type Props = {
	markers: MapMarkerSummary[];
	categoryById: Map<number, MapCategorySummary>;
	onSelect: (marker: MapMarkerSummary) => void;
	onGeoSearch: (lat: number, lng: number) => void;
};

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
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (q.length < 2) return [];
		return markers
			.filter(
				(m) =>
					m.name.toLowerCase().includes(q) ||
					m.city?.toLowerCase().includes(q) ||
					m.postalCode?.includes(q),
			)
			.slice(0, 8);
	}, [markers, query]);

	const handleSelect = useCallback(
		(marker: MapMarkerSummary) => {
			setQuery("");
			setIsOpen(false);
			setActiveIndex(-1);
			onSelect(marker);
		},
		[onSelect],
	);

	const handleGeocode = useCallback(
		async (text: string) => {
			const q = text.trim();
			if (q.length < 2) return;
			setIsOpen(false);
			setActiveIndex(-1);
			try {
				const res = await fetch(
					`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=1`,
				);
				if (!res.ok) return;
				const data = await res.json();
				const feature = data.features?.[0];
				if (!feature) return;
				const [lng, lat] = feature.geometry.coordinates as [number, number];
				setQuery("");
				onGeoSearch(lat, lng);
			} catch {
				// silently ignore network errors
			}
		},
		[onGeoSearch],
	);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setIsOpen(true);
			setActiveIndex((prev) => (prev + 1) % Math.max(results.length, 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex(
				(prev) => (prev - 1 + results.length) % Math.max(results.length, 1),
			);
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (activeIndex >= 0) {
				const marker = results[activeIndex];
				if (marker) handleSelect(marker);
			} else {
				handleGeocode(query);
			}
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
		isOpen && query.trim().length >= 2 && results.length === 0;
	const showDropdown = isOpen && results.length > 0;

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
				onButtonClick={(text) => handleGeocode(text)}
			/>

			{showDropdown ? (
				<ul className={classes.dropdown}>
					{results.map((marker, i) => {
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
		maxHeight: "16rem",
		overflowY: "auto",
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
