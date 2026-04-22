import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import { useState } from "react";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { Loader } from "../ui/Loader";
import { useSearchParams } from "next/navigation";
import CardsDisplayGroup from "../ui/Cards/CardsDisplayGroup";
import { EmptyScreenZone } from "../ui/EmptyScreenZone";

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
				<EmptyScreenZone>
					<Loader />
				</EmptyScreenZone>
			) : coursesData?.length === 0 || !coursesData ? (
				<div className={fr.cx("fr-my-2w")} role="alert" aria-live="assertive">
					Aucune formation trouvée
				</div>
			) : (
				<div
					id="results"
					tabIndex={-1}
					className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-pt-3w")}
				>
					<div className={fr.cx("fr-col-12")} style={{ textAlign: "right" }}>
						<output
							className={fr.cx("fr-text--sm", "fr-mb-0")}
							aria-live="polite"
						>
							{coursesData.length}{" "}
							{coursesData.length > 1 ? "résultats" : "résultat"}
						</output>
					</div>
					<CardsDisplayGroup
						className={fr.cx(
							"fr-col-12",
							"fr-col-sm-6",
							"fr-col-md-12",
							"fr-col-lg-6",
						)}
						courses={coursesData}
						kind="courses"
					/>
				</div>
			)}
		</>
	);
};
