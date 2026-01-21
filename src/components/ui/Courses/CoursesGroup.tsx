import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import Course from "./Course";

export default function CoursesGroup({
	courses,
}: {
	courses: AugmentedCourse[];
}) {
	return (
		<>
			{courses?.map((course) => (
				<div
					key={course.id}
					className={fr.cx(
						"fr-col-12",
						"fr-col-sm-6",
						"fr-col-md-12",
						"fr-col-lg-6",
					)}
					style={{ display: "flex" }}
				>
					<Course course={course} />
				</div>
			))}
		</>
	);
}
