import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react";

export const PersonaMenuLink = ({
	title,
	description,
	icon,
}: {
	title: string;
	description: string;
	icon: string;
}) => {
	const { classes, cx } = useStyles();

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-col-12")}>
			<div className={cx(fr.cx("fr-col-3"), classes.menuLinks)}>
				<span className={icon} aria-hidden="true"></span>
			</div>
			<div className={fr.cx("fr-col-9")}>
				<div className="fr-text--sm fr-text--bold">{title}</div>
				<div className={fr.cx("fr-text--xs")}>{description}</div>
			</div>
		</div>
	);
};

const useStyles = tss.withName(PersonaMenuLink.name).create({
	menuLinks: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
});
