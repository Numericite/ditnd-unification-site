import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import type { PersonaTile } from "../../HomePage/PersonaTiles";
import type { PersonaTypes } from "../../HomePage/PersonaTiles";
import { tss } from "tss-react";

type Props = {
	tiles: PersonaTile[];
	onClick: Record<PersonaTypes, (tile: PersonaTile) => void>;
};

export const PersonaGrid = ({ tiles, onClick }: Props) => {
	const { classes, cx } = useStyles();

	return tiles.map((tile, index) => (
		<div
			key={index}
			className={cx(
				fr.cx("fr-col-12", "fr-col-sm-6", "fr-col-md-4", "fr-col-lg-3"),
				classes.tile,
			)}
		>
			<Tile
				buttonProps={{
					onClick: () => onClick[tile.display](tile),
				}}
				className={cx(classes.noBtn)}
				orientation="vertical"
				title={tile.name}
				detail={tile.description}
				titleAs="h3"
			/>
		</div>
	));
};

const useStyles = tss.withName(PersonaGrid.name).create({
	noBtn: {
		"button::after": {
			visibility: "hidden",
		},
		".fr-tile__content": {
			paddingBottom: `${fr.spacing("3v")} !important`,
		},
	},
	tile: {
		alignItems: "stretch",
		marginLeft: "0",
	},
});
