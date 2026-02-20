import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import CardsDisplayGroup from "../ui/Cards/CardsDisplayGroup";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import { tss } from "tss-react/dsfr";

export default function RecommendedContent({
	courses,
	guides,
}: {
	courses: AugmentedCourse[];
	guides: AugmentedPracticalGuide[];
}) {
	const { classes, cx } = useStyles();

	return (
		<div>
			{guides.length !== 0 && (
				<div className={cx(classes.footerContent, classes.marginContent)}>
					<h3 id="fiches-pratiques">
						Ces fiches pratiques qui pourraient vous intéresser
					</h3>
					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						<CardsDisplayGroup
							className={fr.cx("fr-col-lg-6")}
							guides={guides}
							kind="guides"
						/>
					</div>
				</div>
			)}
			{courses.length !== 0 && (
				<div className={cx(classes.footerContent, classes.marginContent)}>
					<h3 id="formations">
						Ces formations qui pourraient vous intéresser{" "}
					</h3>
					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						<CardsDisplayGroup
							className={fr.cx(
								"fr-col-12",
								"fr-col-sm-6",
								"fr-col-md-12",
								"fr-col-lg-6",
							)}
							courses={courses}
							kind="courses"
						/>
					</div>
				</div>
			)}
		</div>
	);
}

const useStyles = tss.withName(RecommendedContent.name).create(() => ({
	footerContent: {
		borderTop: "2px solid var(--border-default-grey)",
		marginBottom: fr.spacing("3w"),
	},
	marginContent: {
		marginTop: fr.spacing("2w"),
		paddingTop: fr.spacing("2w"),
	},
}));
