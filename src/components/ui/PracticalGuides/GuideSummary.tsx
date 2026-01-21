import { fr } from "@codegouvfr/react-dsfr";
import Summary from "@codegouvfr/react-dsfr/Summary";
import { tss } from "tss-react";
import generateSummary from "~/utils/tools";

export default function GuideSummary({ html }: { html: string }) {
	const { classes, cx } = useStyles();

	return (
		<div
			className={fr.cx(
				"fr-col-12",
				"fr-col-lg-3",
				"fr-col-md-12",
				"fr-col-sm-12",
				"fr-mb-2w",
			)}
		>
			<Summary
				className={cx(classes.summarySticky)}
				links={generateSummary(html).map((link) => ({
					linkProps: link.linkProps,
					text: link.text,
				}))}
				title="Sommaire"
			/>
		</div>
	);
}

const useStyles = tss.withName(GuideSummary.name).create(() => ({
	summarySticky: {
		position: "sticky",
		top: "20px",
		".fr-summary__link:before": {
			visibility: "hidden",
		},
	},
}));
