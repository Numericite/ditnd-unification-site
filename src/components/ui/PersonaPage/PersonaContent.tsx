import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import { slugify } from "~/utils/tools";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import CardsDisplayGroup from "../Cards/CardsDisplayGroup";
import SingleSkipLink from "../SingleSkipLink";

type Props = {
	courses?: AugmentedCourse[];
	guides?: AugmentedPracticalGuide[];
	chapterName: string;
	viewCourse: boolean;
	from?: string;
};

export default function PersonaContent({
	courses,
	guides,
	chapterName,
	viewCourse,
	from,
}: Props) {
	return (
		<>
			<h3 className={fr.cx("fr-pt-3w")} id={slugify(chapterName)}>
				{chapterName}
			</h3>
			<div
				className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}
				id={`contenu-${slugify(chapterName)}`}
			>
				{viewCourse ? (
					<CardsDisplayGroup
						className={fr.cx("fr-col-12", "fr-col-sm-6")}
						courses={courses}
						kind="courses"
					/>
				) : (
					<CardsDisplayGroup
						className={fr.cx("fr-col-12", "fr-col-sm-6")}
						guides={guides}
						kind="guides"
						from={from}
					/>
				)}
			</div>
			<SingleSkipLink label="Retour au sommaire" anchor="#summary" />
		</>
	);
}
