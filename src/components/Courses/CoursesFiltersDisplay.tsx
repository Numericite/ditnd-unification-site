import type { Dispatch, SetStateAction } from "react";
import {
	GuidesFiltersValues,
	type FiltersQuery,
} from "../PracticalGuides/GuidesFiltersDisplay";
import FiltersGroup from "../ui/SearchPage/FiltersGroup";

export const CoursesFiltersDisplay = ({
	setFilters,
}: {
	setFilters: Dispatch<SetStateAction<FiltersQuery>>;
}) => {
	const filters = GuidesFiltersValues();

	filters.push({
		label: "Types de ressource",
		collection: "type",
		value: [
			{ slug: "Webinaire", label: "Webinaire" },
			{ slug: "MOOC", label: "MOOC" },
			{ slug: "Présentiel", label: "Présentiel" },
		],
	});

	return <FiltersGroup filters={filters} setFilters={setFilters} />;
};
