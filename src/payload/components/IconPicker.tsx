"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
	DSFR_ICON_IDS,
	dsfrIconPreviewUrl,
	isDsfrIconId,
} from "../generated/dsfrIcons";
import styles from "./IconPicker.module.css";

const MAX_VISIBLE_OPTIONS = 100;

const normalize = (value: string) =>
	value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/^fr-icon-/, "")
		.replace(/[^a-z0-9]+/g, " ")
		.trim();

const IconPreview = ({ iconId }: { iconId: string | null }) => {
	if (!iconId) {
		return (
			<span
				aria-hidden="true"
				className={`${styles.preview} ${styles.placeholderPreview}`}
			/>
		);
	}

	const url = `url("${dsfrIconPreviewUrl(iconId)}")`;

	return (
		<span
			aria-hidden="true"
			className={styles.preview}
			style={{ maskImage: url, WebkitMaskImage: url }}
		/>
	);
};

const IconPicker: TextFieldClientComponent = ({ field, path }) => {
	const { value, setValue } = useField<string>({ path });
	const { label, required } = field;

	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const listboxRef = useRef<HTMLDivElement>(null);
	const listboxId = useId();
	const inputId = `field-${path.replace(/\./g, "__")}`;

	const selectedIconId = isDsfrIconId(value) ? value : null;

	const matches = useMemo(() => {
		const terms = normalize(query).split(" ").filter(Boolean);
		if (terms.length === 0) return DSFR_ICON_IDS as readonly string[];
		return DSFR_ICON_IDS.filter((iconId) => {
			const haystack = normalize(iconId);
			return terms.every((term) => haystack.includes(term));
		});
	}, [query]);

	const visibleMatches = useMemo(
		() => matches.slice(0, MAX_VISIBLE_OPTIONS),
		[matches],
	);

	useEffect(() => {
		if (!isOpen) return;

		const handlePointerDown = (event: PointerEvent) => {
			if (!wrapperRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
				setQuery("");
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		listboxRef.current
			?.querySelector<HTMLElement>(`.${styles.active}`)
			?.scrollIntoView({ block: "nearest" });
	}, [isOpen, activeIndex]);

	const commit = (iconId: string) => {
		setValue(iconId);
		setQuery("");
		setIsOpen(false);
	};

	const moveActiveIndex = (delta: number) => {
		if (visibleMatches.length === 0) return;
		setActiveIndex((current) => {
			const next = (current + delta) % visibleMatches.length;
			return next < 0 ? visibleMatches.length + next : next;
		});
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
					return;
				}
				moveActiveIndex(1);
				return;
			case "ArrowUp":
				event.preventDefault();
				if (!isOpen) return;
				moveActiveIndex(-1);
				return;
			case "Enter": {
				if (!isOpen) return;
				event.preventDefault();
				const iconId = visibleMatches[activeIndex];
				if (iconId) commit(iconId);
				return;
			}
			case "Escape":
				if (!isOpen) return;
				event.preventDefault();
				setIsOpen(false);
				setQuery("");
				return;
			case "Tab":
				setIsOpen(false);
				setQuery("");
				return;
			default:
		}
	};

	return (
		<div className="field-type text">
			<FieldLabel htmlFor={inputId} label={label} required={required} />
			<div className={styles.wrapper} ref={wrapperRef}>
				<div className={styles.control}>
					<IconPreview iconId={selectedIconId} />
					<input
						aria-activedescendant={
							isOpen && visibleMatches[activeIndex]
								? `${listboxId}-${activeIndex}`
								: undefined
						}
						aria-autocomplete="list"
						aria-controls={isOpen ? listboxId : undefined}
						aria-expanded={isOpen}
						className={styles.input}
						id={inputId}
						onChange={(event) => {
							setQuery(event.target.value);
							setActiveIndex(0);
							setIsOpen(true);
						}}
						onFocus={() => setIsOpen(true)}
						onKeyDown={handleKeyDown}
						placeholder={selectedIconId ?? "Rechercher une icône DSFR"}
						role="combobox"
						type="text"
						value={isOpen ? query : (selectedIconId ?? "")}
					/>
					{selectedIconId && (
						<button
							aria-label="Retirer l'icône"
							className={styles.clear}
							onClick={() => {
								setValue("");
								setQuery("");
							}}
							type="button"
						>
							×
						</button>
					)}
				</div>

				{isOpen && (
					<div
						className={styles.listbox}
						id={listboxId}
						ref={listboxRef}
						role="listbox"
						tabIndex={-1}
					>
						{visibleMatches.length === 0 && (
							<p className={styles.empty}>Aucune icône ne correspond.</p>
						)}
						{visibleMatches.map((iconId, index) => (
							<div
								aria-selected={iconId === selectedIconId}
								className={`${styles.option} ${index === activeIndex ? styles.active : ""}`}
								id={`${listboxId}-${index}`}
								key={iconId}
								onMouseDown={(event) => {
									event.preventDefault();
									commit(iconId);
								}}
								onMouseEnter={() => setActiveIndex(index)}
								role="option"
								tabIndex={-1}
							>
								<IconPreview iconId={iconId} />
								<span className={styles.optionLabel}>{iconId}</span>
							</div>
						))}
						{matches.length > visibleMatches.length && (
							<p className={styles.more}>
								{matches.length - visibleMatches.length} autres résultats,
								affinez la recherche.
							</p>
						)}
					</div>
				)}
			</div>
			<div className="field-description">
				{DSFR_ICON_IDS.length} icônes du Système de design de l&apos;État.
				Laisser vide pour ne pas afficher d&apos;icône.
			</div>
		</div>
	);
};

export default IconPicker;
