import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import Course from "../Courses/Course";

function courseQuery({
	course,
	condition,
	query,
}: {
	course: AugmentedCourse;
	condition: string;
	query: string;
}) {
	return (
		course.condition.slug === condition &&
		(course.description.toLowerCase().includes(query) ||
			course.title.toLowerCase().includes(query) ||
			course.theme.name.toLowerCase().includes(query))
	);
}

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
		.filter((c) => courseQuery({ course: c, condition, query: loweredQuery }))
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
