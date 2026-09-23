import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";

export default function BackToTop() {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(fr.cx("fr-container"), classes.root)}>
			<a
				className={fr.cx(
					"fr-link",
					"fr-icon-arrow-up-fill",
					"fr-link--icon-left",
				)}
				href="#top"
			>
				Haut de page
			</a>
		</div>
	);
}

const useStyles = tss.withName(BackToTop.name).create({
	root: {
		display: "flex",
		justifyContent: "flex-end",
		marginTop: fr.spacing("4w"),
		marginBottom: fr.spacing("2w"),
	},
});
