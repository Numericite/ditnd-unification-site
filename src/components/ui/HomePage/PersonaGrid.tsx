import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import { useRef, useState } from "react";
import type { PersonaTile } from "../../HomePage/PersonaTiles";
import type { PersonaTypes } from "../../HomePage/PersonaTiles";
import { pictogramMap } from "~/utils/tools";

type Props = {
	tiles: PersonaTile[];
	onClick: Record<PersonaTypes, (tile: PersonaTile) => void>;
	ariaLabel?: string;
};

export const PersonaGrid = ({ tiles, onClick, ariaLabel }: Props) => {
	const [focusedIndex, setFocusedIndex] = useState(0);
	const gridRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (tiles.length === 0) return;

		let newIndex = focusedIndex;

		switch (e.key) {
			case "ArrowRight":
			case "ArrowDown":
				e.preventDefault();
				newIndex = (focusedIndex + 1) % tiles.length;
				break;
			case "ArrowLeft":
			case "ArrowUp":
				e.preventDefault();
				newIndex = (focusedIndex - 1 + tiles.length) % tiles.length;
				break;
			default:
				return;
		}

		setFocusedIndex(newIndex);
		const radios =
			gridRef.current?.querySelectorAll<HTMLElement>('[role="radio"]');
		radios?.[newIndex]?.focus();
	};

	return (
		<div
			ref={gridRef}
			role="radiogroup"
			aria-label={ariaLabel}
			className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mt-6v")}
			onKeyDown={handleKeyDown}
		>
			{tiles.map((tile, index) => {
				const PictogramComponent = tile.pictogram
					? pictogramMap[tile.pictogram]
					: null;

				const lgColClass =
					tiles.length === 3 ? "fr-col-lg-4" : "fr-col-lg-3";

				return (
					<div
						key={index}
						className={fr.cx(
							"fr-col-12",
							"fr-col-sm-6",
							"fr-col-md-4",
							lgColClass,
						)}
					>
						<Tile
							pictogram={
								PictogramComponent ? <PictogramComponent /> : undefined
							}
							buttonProps={{
								onClick: () => onClick[tile.display](tile),
								role: "radio",
								"aria-checked": false,
								tabIndex: index === focusedIndex ? 0 : -1,
								onFocus: () => setFocusedIndex(index),
							}}
							noIcon
							orientation="vertical"
							title={tile.name}
							detail={tile.description}
							titleAs="h3"
						/>
					</div>
				);
			})}
		</div>
	);
};
