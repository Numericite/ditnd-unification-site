import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import { slugify } from "~/utils/tools";
import CardDisplay from "../Courses/CardDisplay";

type Props = {
	value: AugmentedCourse[];
	chapterName: string;
};

export function courseQuery(
	course: AugmentedCourse,
	condition: string,
	query: string,
) {
	return (
		course.condition.slug.toLowerCase() === condition &&
		(course.description.toLowerCase().includes(query) ||
			course.title.toLowerCase().includes(query) ||
			course.theme.name.toLowerCase().includes(query))
	);
}

export default function PersonaCoursesContent({ value, chapterName }: Props) {
	return (
		<>
			<h3 className={fr.cx("fr-pt-3w")} id={slugify(chapterName)}>
				{chapterName}
			</h3>
			<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
				{value.map((course, index) => (
					<div
						key={`courses ${index}`}
						className={fr.cx("fr-col-12", "fr-col-sm-6")}
						style={{ display: "flex" }}
					>
						<CardDisplay
							{...course}
							imageUrl={course.image?.url ?? undefined}
							imageAlt={course.image?.alt}
							conditions={[course.condition]}
							themes={[course.theme]}
							kind="Courses"
							redirect="/"
						/>
					</div>
				))}
			</div>
		</>
	);
}
