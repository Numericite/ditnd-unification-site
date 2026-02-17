import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import { pictogramMap } from "~/utils/tools";

const SubMenuCustom = ({ persona }: { persona: PersonaTile }) => {
	const { classes } = useStyles();

	const PictogramComponent = persona.pictogram
		? pictogramMap[persona.pictogram]
		: null;

	return (
		<div className={classes.personaContainer}>
			{PictogramComponent ? <PictogramComponent fontSize="56px" /> : undefined}
			<div className={classes.personaInfo}>
				<p className={classes.personaName}>{persona.name}</p>
				<p className={classes.personaDescription}>{persona.description}</p>
			</div>
		</div>
	);
};

const useStyles = tss.withName(SubMenuCustom.name).create(() => ({
	personaContainer: {
		display: "flex",
		alignItems: "center",
		gap: fr.spacing("2w"),
		marginTop: fr.spacing("1v"),
		pointerEvents: "none",
	},
	personaInfo: {
		display: "flex",
		flexDirection: "column",
	},
	personaName: {
		fontWeight: "bold",
		fontSize: "14px",
	},
	personaDescription: {
		color: fr.colors.decisions.text.default.grey.default,
		fontSize: "12px",
	},
}));

export default SubMenuCustom;
