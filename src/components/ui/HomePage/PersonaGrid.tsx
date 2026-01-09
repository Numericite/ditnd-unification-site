import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import type { PersonaTile } from "../../HomePage/PersonaTiles";
import type { PersonaTypes } from "../../HomePage/PersonaTiles";

type Props = {
	tiles: PersonaTile[];
	onClick: Record<PersonaTypes, (tile: PersonaTile) => void>;
};

export const PersonaGrid = ({ tiles, onClick }: Props) => (
	<>
		{tiles.map((tile, index) => (
			<div
				key={index}
				className={fr.cx(
					"fr-col-12",
					"fr-col-sm-6",
					"fr-col-md-4",
					"fr-col-lg-3",
				)}
				style={{
					alignItems: "stretch",
					marginLeft: 0,
				}}
			>
				<Tile
					enlargeLinkOrButton
					buttonProps={{
						onClick: () => {
							onClick[tile.display](tile);
						},
					}}
					orientation="vertical"
					title={tile.name}
					detail={tile.description}
					titleAs="h3"
				/>
			</div>
		))}
	</>
);
