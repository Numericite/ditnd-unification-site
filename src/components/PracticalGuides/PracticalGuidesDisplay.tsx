import { fr } from "@codegouvfr/react-dsfr";
import WysiwygContent from "../ui/PracticalGuides/WysiwigContent";
import ShareSocials from "../ui/PracticalGuides/ShareSocials";
import RecommendedGuides from "./RecommendedGuides";
import { tss } from "tss-react";
import RecommendedCourses from "./RecommendedCourses";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import generateSummary from "~/utils/tools";
import SummaryContent from "../ui/PracticalGuides/SummaryContent";

export default function PracticalGuidesDisplay({
	guide,
}: {
	guide: AugmentedPracticalGuide;
}) {
	const { classes, cx } = useStyles();

	const menuLinks = generateSummary(guide.html).map((link) => ({
		linkProps: link.linkProps,
		text: link.text,
	}));

	if (guide["practical-guides"].length > 0)
		menuLinks.push({
			linkProps: { href: `#fiches-pratiques` },
			text: "Ces fiches pratiques qui pourraient vous intéresser",
		});
	if (guide.courses.length > 0)
		menuLinks.push({
			linkProps: { href: `#formations` },
			text: "Ces formations qui pourraient vous intéresser",
		});

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
			<SummaryContent
				menuLinks={menuLinks}
				title="Sommaire"
				className={cx(classes.summarySticky)}
			/>
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
		height: "240px",
		objectFit: "cover",
	},
	summarySticky: {
		position: "sticky",
		top: "20px",
		".fr-summary__link:before": {
			visibility: "hidden",
		},
	},
}));
