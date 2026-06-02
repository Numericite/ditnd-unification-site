import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";

type Props = {
	total: number;
	/** When true, the live region is mounted but empty — used while loading
	 * so screen readers don't read a stale count and only announce on update. */
	hidden?: boolean;
};

export const ResultsCount = ({ total, hidden = false }: Props) => {
	const { classes } = useStyles();
	return (
		<div className={classes.wrapper}>
			<output
				className={fr.cx("fr-text--sm", "fr-mb-0")}
				aria-live="polite"
				aria-atomic="true"
			>
				{hidden ? "" : `${total} ${total > 1 ? "résultats" : "résultat"}`}
			</output>
		</div>
	);
};

const useStyles = tss.withName("ResultsCount").create({
	wrapper: {
		marginTop: fr.spacing("3w"),
		textAlign: "right",
		minHeight: "1.25rem",
	},
});
