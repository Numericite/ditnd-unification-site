import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import { useState } from "react";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { Loader } from "../ui/Loader";
import CoursesGroup from "../ui/Courses/CoursesGroup";

export type CoursesFiltersQuery = {
	conditions: string[];
	themes: string[];
	personas: string[];
	type: string[];
};

export const SearchCoursesDisplay = ({
	filters,
}: {
	filters: CoursesFiltersQuery;
}) => {
	const [query, setQuery] = useState<string>("");

	const { data: coursesData, isLoading: isLoadingCourses } =
		api.course.getByFilters.useQuery({ ...filters, text: query });

	return (
		<>
			<SearchBarUI onClick={(query) => setQuery(query)} />
			{isLoadingCourses ? (
				<Loader />
			) : coursesData?.length === 0 || !coursesData ? (
				<div className={fr.cx("fr-my-2w")}>Aucune formation trouvée</div>
			) : (
				<div
					className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-pt-3w")}
				>
					<CoursesGroup courses={coursesData} />
				</div>
			)}
		</>
	);
};
