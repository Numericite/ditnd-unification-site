import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import type { TDH } from "~/state/store";
import { getPictoByPersonaSlug } from "~/utils/personas";

type SubMenuCustomProps = {
	persona: PersonaTile;
	conditions: TDH[];
	isActive: boolean;
};

const SubMenuCustom = ({
	persona,
	conditions,
	isActive,
}: SubMenuCustomProps) => {
	const { classes } = useStyles();

	const Picto = getPictoByPersonaSlug(persona.slug);

	return (
		<>
			<div className={classes.personaContainer}>
				<Picto fontSize="56px" />
				<div className={classes.personaInfo}>
					<p className={classes.personaName}>{persona.name}</p>
					<p className={classes.personaDescription}>{persona.description}</p>
				</div>
			</div>
			{isActive && (
				<div className={classes.submenuPanel}>
					<p>Intéressé par ({persona.name}) :</p>
					<div className={classes.conditionsGrid}>
						{conditions?.map((condition) => (
							<div key={condition.id} className={classes.conditionCard}>
								<p className={classes.conditionName}>{condition.name}</p>
								<p className={classes.conditionDescription}>
									{condition.description}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
};

const useStyles = tss.withName(SubMenuCustom.name).create(() => ({
	personaContainer: {
		display: "flex",
		alignItems: "center",
		gap: fr.spacing("2w"),
		padding: fr.spacing("2v"),
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
	submenuPanel: {
		position: "absolute",
		left: "100%",
		top: 0,
		width: "max-content",
		height: "min-content",
		background: "white",
		padding: "1rem",
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("3v"),
	},
	conditionsGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: fr.spacing("2w"),
	},
	conditionCard: {
		display: "flex",
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		flexDirection: "column",
		maxWidth: "350px",
		padding: `${fr.spacing("2w")} ${fr.spacing("3w")}`,
	},
	conditionName: {
		fontWeight: "bold",
		fontSize: "14px",
	},
	conditionDescription: {
		fontSize: "12px",
	},
}));

export default SubMenuCustom;
