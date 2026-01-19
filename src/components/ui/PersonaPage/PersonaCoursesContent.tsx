import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import Course from "../Courses/Course";

export default function PersonaCoursesContent({
	value,
	condition,
	query,
}: {
	value: AugmentedCourse[];
	condition: string;
	query: string;
}) {
	const loweredQuery = query.toLowerCase();
	return value
		.filter(
			(c) =>
				c.condition.slug === condition &&
				(c.description.toLowerCase().includes(loweredQuery) ||
					c.title.toLowerCase().includes(loweredQuery) ||
					c.theme.name.toLowerCase().includes(loweredQuery)),
		)
		.map((course, index) => (
			<div
				key={`guide${index}`}
				className={fr.cx("fr-col-12", "fr-col-sm-6")}
				style={{ display: "flex" }}
			>
				<Course key={`${course.title + index}`} course={course} />
			</div>
		));
}
