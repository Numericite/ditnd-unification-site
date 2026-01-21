import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import CoursesGroup from "../ui/Courses/CoursesGroup";

export default function RecommendedCourses({
	courses,
}: {
	courses: AugmentedCourse[];
}) {
	return (
		<div>
			{courses.length !== 0 && (
				<div className={fr.cx("fr-mt-2w")}>
					<h3 id="formations">
						Ces formations qui pourraient vous intéresser{" "}
					</h3>
					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						<CoursesGroup courses={courses} />
					</div>
				</div>
			)}
		</div>
	);
}
