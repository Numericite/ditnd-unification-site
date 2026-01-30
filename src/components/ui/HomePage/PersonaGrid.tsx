import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import type { PersonaTile } from "../../HomePage/PersonaTiles";
import type { PersonaTypes } from "../../HomePage/PersonaTiles";

type Props = {
	tiles: PersonaTile[];
	imageUrl?: string;
	onClick: Record<PersonaTypes, (tile: PersonaTile) => void>;
};

export const PersonaGrid = ({ tiles, onClick }: Props) => {
	return tiles.map((tile, index) => {
		let pictogramProp = {};
		if (tile.pictogram) pictogramProp = { pictogram: tile.pictogram };

		return (
			<div
				key={index}
				className={fr.cx(
					"fr-col-12",
					"fr-col-sm-6",
					"fr-col-md-4",
					"fr-col-lg-3",
				)}
			>
				<Tile
					{...pictogramProp}
					buttonProps={{
						onClick: () => onClick[tile.display](tile),
					}}
					noIcon
					orientation="vertical"
					title={tile.name}
					detail={tile.description}
					titleAs="h3"
				/>
			</div>
		);
	});
};
