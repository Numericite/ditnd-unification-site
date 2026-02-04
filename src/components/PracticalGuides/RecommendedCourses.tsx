import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import CardsDisplayGroup from "../ui/Cards/CardsDisplayGroup";

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
