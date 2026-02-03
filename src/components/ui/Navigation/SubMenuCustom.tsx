import { fr } from "@codegouvfr/react-dsfr";
import { useRouter } from "next/router";
import { tss } from "tss-react";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import { pictogramMap } from "~/pages";

type SubMenuCustomProps = {
	persona: PersonaTile;
	personaPros: PersonaTile[];
	isActive: boolean;
};

const ProfessionalPanelSlugs = ({
	personaPros,
}: {
	personaPros: PersonaTile[];
}) => {
	const router = useRouter();
	const { classes, cx } = useStyles({ personaSlug: "professional" });
	return (
		<div className={classes.submenuPanel}>
			<p className={classes.submenuPanelHeading}>Types de professionnels :</p>
			<div className={cx(classes.conditionsGrid)}>
				{personaPros?.map((personaPro) => (
					<button
						className={cx(classes.submenuPanelButton)}
						key={personaPro.slug}
						type="button"
						onClick={() => router.push(`/journeys/${personaPro.slug}`)}
						onMouseDown={(e) => e.stopPropagation()}
					>
						<div className={cx(classes.conditionCard)}>
							<p className={classes.conditionName}>{personaPro.name}</p>
							<p className={classes.conditionDescription}>
								{personaPro.description}
							</p>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

const SubMenuCustom = ({
	persona,
	personaPros,
	isActive,
}: SubMenuCustomProps) => {
	const { classes } = useStyles({ personaSlug: persona.slug });

	const PictogramComponent = persona.pictogram
		? pictogramMap[persona.pictogram]
		: null;

	return (
		<>
			<div className={classes.personaContainer}>
				{PictogramComponent ? (
					<PictogramComponent fontSize="56px" />
				) : undefined}
				<div className={classes.personaInfo}>
					<p className={classes.personaName}>{persona.name}</p>
					<p className={classes.personaDescription}>{persona.description}</p>
				</div>
			</div>
			{isActive && <ProfessionalPanelSlugs personaPros={personaPros} />}
		</>
	);
};

const useStyles = tss
	.withName(SubMenuCustom.name)
	.withParams<{ personaSlug: string }>()
	.create(({ personaSlug }) => ({
		personaContainer: {
			display: "flex",
			alignItems: "center",
			gap: fr.spacing("2w"),
			marginTop: fr.spacing("1v"),
			pointerEvents: personaSlug !== "professional" ? "none" : "auto",
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
			bottom: 0,
			width: "max-content",
			height: "auto",
			border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
			background: "white",
			padding: fr.spacing("3w"),
			display: "flex",
			justifyContent: "center",
			flexDirection: "column",
			gap: fr.spacing("2v"),
			cursor: "default",
		},
		submenuPanelHeading: {
			fontSize: "14px",
		},
		submenuPanelButton: {
			paddingInline: "0px",
		},
		conditionsGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(2, 1fr)",
			gap: fr.spacing("2w"),
		},
		conditionCard: {
			display: "flex",
			border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
			height: "100%",
			justifyContent: "center",
			flexDirection: "column",
			maxWidth: "300px",
			padding: `${fr.spacing("2w")} ${fr.spacing("3w")}`,
			":hover": {
				backgroundColor: fr.colors.decisions.background.default.grey.hover,
			},
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
