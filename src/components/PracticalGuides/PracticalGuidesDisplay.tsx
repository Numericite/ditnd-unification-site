import { fr } from "@codegouvfr/react-dsfr";
import GuideSummary from "../ui/PracticalGuides/GuideSummary";
import WysiwygContent from "../ui/PracticalGuides/WysiwigContent";
import ShareSocials from "../ui/PracticalGuides/ShareSocials";
import RecommendedGuides from "./RecommendedGuides";
import { tss } from "tss-react";
import RecommendedCourses from "./RecommendedCourses";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

export default function PracticalGuidesDisplay({
	guide,
}: {
	guide: AugmentedPracticalGuide;
}) {
	const { classes, cx } = useStyles();

	const image = guide.imageBanner;

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			{image?.url && (
				<div className={fr.cx("fr-col-12")}>
					<img
						className={cx(fr.cx("fr-responsive-img"), classes.imageBanner)}
						alt={image.alt}
						src={image.url}
					/>
				</div>
			)}
			<GuideSummary html={guide.html} />
			<div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
				<WysiwygContent title={guide.title} html={guide.html} />
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
				</div>
				<div className={cx(classes.footerContent)}>
					{guide.courses && (
						<div className={cx(classes.marginContent)}>
							<RecommendedCourses courses={guide.courses} />
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
	imageBanner: {
		width: "100%",
		height: "100%",
		objectFit: "cover",
	},
}));
