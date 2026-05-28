import { useEffect, useRef, useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { tss } from "tss-react/dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

export type MultiSelectOption = {
	value: string;
	label: string;
};

type Props = {
	id: string;
	label: string;
	hint?: string;
	legend?: string;
	legendHint?: string;
	options: MultiSelectOption[];
	selectedValues: string[];
	onChange: (values: string[]) => void;
};

export default function MultiSelect({
	id,
	label,
	hint,
	legend,
	legendHint,
	options,
	selectedValues,
	onChange,
}: Props) {
	const { classes, cx } = useStyles();
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const filteredOptions = options.filter((opt) =>
		opt.label.toLowerCase().includes(search.toLowerCase().trim()),
	);

	const allFilteredSelected =
		filteredOptions.length > 0 &&
		filteredOptions.every((opt) => selectedValues.includes(opt.value));

	const triggerLabel =
		selectedValues.length === 0
			? "Sélectionner"
			: `${selectedValues.length} option${selectedValues.length > 1 ? "s" : ""} sélectionnée${selectedValues.length > 1 ? "s" : ""}`;

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => searchInputRef.current?.focus(), 50);
		} else {
			setSearch("");
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		function handleClick(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") setIsOpen(false);
		}
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [isOpen]);

	const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
		e.preventDefault();
		const panel = panelRef.current;
		if (!panel) return;
		const focusable = Array.from(
			panel.querySelectorAll<HTMLElement>(
				'input[type="search"], button, input[type="checkbox"]',
			),
		).filter((el) => !(el as HTMLInputElement | HTMLButtonElement).disabled);
		if (focusable.length === 0) return;
		const current = document.activeElement as HTMLElement;
		const idx = focusable.indexOf(current);
		if (e.key === "ArrowDown") focusable[(idx + 1) % focusable.length]?.focus();
		else if (e.key === "ArrowUp")
			focusable[(idx - 1 + focusable.length) % focusable.length]?.focus();
		else if (e.key === "Home") focusable[0]?.focus();
		else if (e.key === "End") focusable[focusable.length - 1]?.focus();
	};

	const handleToggle = (value: string) => {
		onChange(
			selectedValues.includes(value)
				? selectedValues.filter((v) => v !== value)
				: [...selectedValues, value],
		);
	};

	const handleSelectAll = () => {
		const toAdd = filteredOptions.map((opt) => opt.value);
		onChange(Array.from(new Set([...selectedValues, ...toAdd])));
	};

	const handleDeselectAll = () => {
		const filteredSet = new Set(filteredOptions.map((opt) => opt.value));
		onChange(selectedValues.filter((v) => !filteredSet.has(v)));
	};

	return (
		<div ref={containerRef} className={classes.root}>
			<label
				className={cx(fr.cx("fr-label"), classes.label)}
				htmlFor={`${id}-trigger`}
				id={`${id}-label`}
			>
				{label}
				{hint ? <span className={fr.cx("fr-hint-text")}>{hint}</span> : null}
			</label>

			<button
				id={`${id}-trigger`}
				type="button"
				className={cx(
					classes.trigger,
					fr.cx(
						isOpen ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line",
					),
				)}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-labelledby={`${id}-label`}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				{triggerLabel}
			</button>

			{isOpen ? (
				// biome-ignore lint/a11y/useSemanticElements: keyboard nav handler on panel wrapper
				<div
					ref={panelRef}
					className={classes.panel}
					onKeyDown={handlePanelKeyDown}
					role="group"
				>
					<div className={classes.searchBar}>
						<Input
							label="Rechercher"
							hideLabel
							iconId="fr-icon-search-line"
							className={classes.searchInputGroup}
							nativeInputProps={{
								ref: searchInputRef,
								id: `${id}-search`,
								type: "search",
								placeholder: "Rechercher",
								value: search,
								onChange: (e) => setSearch(e.target.value),
							}}
						/>
					</div>

					<Button
						iconId={
							allFilteredSelected
								? "fr-icon-close-circle-line"
								: "fr-icon-checkbox-circle-line"
						}
						className={cx(
							classes.selectAllBtn,
							fr.cx(
								allFilteredSelected
									? "fr-icon-close-circle-line"
									: "fr-icon-checkbox-circle-line",
							),
						)}
						onClick={allFilteredSelected ? handleDeselectAll : handleSelectAll}
					>
						{allFilteredSelected ? "Tout désélectionner" : "Tout sélectionner"}
					</Button>

					{filteredOptions.length === 0 ? (
						<p className={classes.noResults}>Aucun résultat</p>
					) : (
						<Checkbox
							legend={legend}
							hintText={legendHint}
							small
							className={classes.checkboxRoot}
							classes={{ content: classes.checkList }}
							options={filteredOptions.map((opt) => ({
								label: opt.label,
								nativeInputProps: {
									checked: selectedValues.includes(opt.value),
									onChange: () => handleToggle(opt.value),
								},
							}))}
						/>
					)}
				</div>
			) : null}
		</div>
	);
}

const useStyles = tss.withName("MultiSelect").create(() => ({
	root: {
		position: "relative",
	},

	label: {
		margin: 0,
		marginBottom: "0.5rem",
	},

	trigger: {
		all: "unset",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
		padding: "0.5rem 1rem",
		boxSizing: "border-box",
		backgroundColor: fr.colors.decisions.background.contrast.grey.default,
		color: fr.colors.decisions.text.default.grey.default,
		borderBottom: `2px solid ${fr.colors.decisions.border.plain.grey.default}`,
		cursor: "pointer",
		fontSize: "1rem",
		lineHeight: 1.5,
		"&:hover": {
			backgroundColor: `${fr.colors.decisions.background.contrast.grey.hover} !important`,
		},
		"&::before": {
			order: 1,
			flexShrink: 0,
		},
	},

	panel: {
		position: "absolute",
		top: "calc(100% + 0.25rem)",
		left: 0,
		right: 0,
		zIndex: 1000,
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
		display: "flex",
		flexDirection: "column",
	},

	selectAllBtn: {
		all: "unset",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "0.5rem",
		width: "100%",
		padding: "0.75rem 1rem",
		boxSizing: "border-box",
		cursor: "pointer",
		color: fr.colors.decisions.text.actionHigh.blueFrance.default,
		fontWeight: 500,
		fontSize: "0.9375rem",
		borderBottom: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		"&:hover": {
			backgroundColor: `${fr.colors.decisions.background.alt.blueFrance.default} !important`,
		},
	},

	searchBar: {
		paddingInline: "0.75rem",
		borderBottom: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
	},
	searchInputGroup: {
		padding: "0 !important",
		marginBottom: "0.5rem",
		"& .fr-input-wrap": {
			color: `${fr.colors.decisions.text.mention.grey.default} !important`,
		},
	},

	checkboxRoot: {
		margin: "0 !important",
		padding: "1rem",
	},
	checkList: {
		maxHeight: "260px",
		overflowY: "auto",
		paddingRight: "0.25rem",
	},
	noResults: {
		margin: "0.5rem 0",
		fontSize: "0.875rem",
		color: fr.colors.decisions.text.mention.grey.default,
	},
}));
