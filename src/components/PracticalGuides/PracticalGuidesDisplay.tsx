import { fr } from "@codegouvfr/react-dsfr";
import GuideSummary from "../ui/PracticalGuides/GuideSummary";
import WysiwygContent from "../ui/PracticalGuides/WysiwigContent";
import ShareSocials from "../ui/PracticalGuides/ShareSocials";
import RecommendedGuides from "./RecommendedGuides";
import { tss } from "tss-react";
import type { PracticalGuide } from "~/payload/payload-types";

export default function PracticalGuidesDisplay({
	guide,
}: {
	guide: PracticalGuide;
}) {
	const { classes, cx } = useStyles();

	return (
		<div className={fr.cx("fr-grid-row")}>
			<GuideSummary html={guide.html} />
			<div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
				<h4>Fiches pratiques</h4>
				<WysiwygContent html={guide.html} />
				<div className={cx(classes.footerContent)}>
					<div className={cx(classes.marginContent)}>
						<p className={fr.cx("fr-text--md")}>Partager la page</p>
						<ShareSocials />
					</div>
				</div>
				<div className={cx(classes.footerContent)}>
					{guide["practical-guides"] && (
						<RecommendedGuides guides={guide["practical-guides"]} />
					)}
					{guide.courses?.length !== 0 && (
						<div className={cx(classes.marginContent)}>
							<h5 id="formations">
								Ces formations qui pourraient vous intéresser{" "}
							</h5>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName(PracticalGuidesDisplay.name).create(() => ({
	footerContent: {
		borderTop: "2px solid var(--border-default-grey)",
		marginBottom: fr.spacing("3w"),
	},
	marginContent: {
		marginTop: fr.spacing("2w"),
	},
}));
