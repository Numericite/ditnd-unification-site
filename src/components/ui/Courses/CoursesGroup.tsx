import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import CardDisplay from "./CardDisplay";

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
					<CardDisplay
						title={course.title}
						description={course.description}
						type={course.type}
						conditions={[course.condition]}
						themes={[course.theme]}
						imageUrl={course.image?.url ?? undefined}
						imageAlt={course.image?.alt}
						kind="Courses"
						redirect="/"
					/>
				</div>
			))}
		</>
	);
}
