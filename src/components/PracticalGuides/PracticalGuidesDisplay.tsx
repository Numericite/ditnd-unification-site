import { fr } from "@codegouvfr/react-dsfr";
import WysiwygContent from "../ui/PracticalGuides/WysiwygContent";
import ShareSocials from "../ui/PracticalGuides/ShareSocials";
import RecommendedGuides from "./RecommendedGuides";
import { tss } from "tss-react/dsfr";
import RecommendedCourses from "./RecommendedCourses";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import type { Link } from "~/utils/tools";
import SummaryContent from "../ui/PracticalGuides/SummaryContent";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PracticalGuidesDisplay({
	guide,
}: {
	guide: AugmentedPracticalGuide;
}) {
	const { classes, cx } = useStyles();

	const [links, setMenuLinks] = useState<Link[]>([]);

	useEffect(() => {
		const optionalLinks: Link[] = [];

		if (guide["practical-guides"].length > 0) {
			optionalLinks.push({
				linkProps: { href: "#fiches-pratiques" },
				text: "Ces fiches pratiques qui pourraient vous intéresser",
			});
		}

		if (guide.courses.length > 0) {
			optionalLinks.push({
				linkProps: { href: "#formations" },
				text: "Ces formations qui pourraient vous intéresser",
			});
		}

		setMenuLinks((prev) => [...prev, ...optionalLinks]);
	}, [guide]);

	const image = guide.imageBanner;

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			{image?.url && (
				<div className={fr.cx("fr-col-12")}>
					<Image
						className={cx(fr.cx("fr-responsive-img"), classes.imageBanner)}
						fetchPriority="high"
						priority
						alt={image.alt}
						src={image.url}
						width={1200}
						height={240}
					/>
				</div>
			)}
			<SummaryContent
				menuLinks={links}
				title="Sommaire"
				className={cx(classes.summarySticky)}
			/>
			<div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
				<WysiwygContent
					title={guide.title}
					content={guide.content}
					setMenuLinks={setMenuLinks}
				/>

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
