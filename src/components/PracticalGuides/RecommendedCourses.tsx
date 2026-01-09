import Course from "../ui/Courses/Course";
import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";

export default function RecommendedCourses({
	courses,
}: {
	courses: AugmentedCourse[];
}) {
	return (
		<div>
			{courses.length !== 0 && (
				<div className={fr.cx("fr-mt-2w")}>
					<h5 id="formations">
						Ces formations qui pourraient vous intéresser{" "}
					</h5>
					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						{courses?.map((course, index) => {
							return (
								<div
									key={`guide${index}`}
									className={fr.cx("fr-col-12", "fr-col-sm-6")}
									style={{ display: "flex" }}
								>
									<Course key={`${course.title + index}`} course={course} />
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
