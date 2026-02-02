import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import { useState } from "react";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { Loader } from "../ui/Loader";
import { useSearchParams } from "next/navigation";
import CardsDisplayGroup from "../ui/Cards/CardsDisplayGroup";

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
	const searchParams = useSearchParams();

	const search = searchParams?.get("search");

	const [query, setQuery] = useState<string>(search ?? "");

	const { data: coursesData, isLoading: isLoadingCourses } =
		api.course.getByFilters.useQuery({ ...filters, text: query });

	return (
		<>
			<SearchBarUI value={query} onClick={(query) => setQuery(query)} />
			{isLoadingCourses ? (
				<Loader />
			) : coursesData?.length === 0 || !coursesData ? (
				<div className={fr.cx("fr-my-2w")}>Aucune formation trouvée</div>
			) : (
				<div
					className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-pt-3w")}
				>
					<CardsDisplayGroup
						className={fr.cx(
							"fr-col-12",
							"fr-col-sm-6",
							"fr-col-md-12",
							"fr-col-lg-6",
						)}
						courses={coursesData}
						kind="Courses"
					/>
				</div>
			)}
		</>
	);
};
