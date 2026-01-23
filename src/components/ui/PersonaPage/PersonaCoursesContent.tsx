import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import Course from "../Courses/Course";
import { slugify } from "~/utils/tools";

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
		course.condition.slug === condition &&
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
						key={`guide${index}`}
						className={fr.cx("fr-col-12", "fr-col-sm-6")}
						style={{ display: "flex" }}
					>
						<Course key={`${course.title + index}`} course={course} />
					</div>
				))}
			</div>
		</>
	);
}
