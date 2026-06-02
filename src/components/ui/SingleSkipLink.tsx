import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";

type Props = {
	label: string;
	anchor: string;
};

export default function SingleSkipLink({ label, anchor }: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={fr.cx("fr-skiplinks")}>
			<a className={cx(fr.cx("fr-link"), classes.link)} href={anchor}>
				{label}
			</a>
		</div>
	);
}

const useStyles = tss.withName(SingleSkipLink.name).create({
	link: {
		fontSize: "1rem",
		lineHeight: "1.5rem",
		padding: 0,
	},
});
