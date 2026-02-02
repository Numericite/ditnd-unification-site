import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import { slugify } from "~/utils/tools";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import CardsDisplayGroup from "../Cards/CardsDisplayGroup";

type Props = {
	courses?: AugmentedCourse[];
	guides?: AugmentedPracticalGuide[];
	chapterName: string;
	viewCourse: boolean;
};

export default function PersonaContent({
	courses,
	guides,
	chapterName,
	viewCourse,
}: Props) {
	return (
		<>
			<h3 className={fr.cx("fr-pt-3w")} id={slugify(chapterName)}>
				{chapterName}
			</h3>
			<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
				{viewCourse ? (
					<CardsDisplayGroup
						className={fr.cx("fr-col-12", "fr-col-sm-6")}
						courses={courses}
						kind="Courses"
					/>
				) : (
					<CardsDisplayGroup
						className={fr.cx("fr-col-12", "fr-col-sm-6")}
						guides={guides}
						kind="Guides"
					/>
				)}
			</div>
			<SkipLinks
				links={[
					{
						label: "Retour au sommaire",
						anchor: "#summary",
					},
				]}
			/>
		</>
	);
}
