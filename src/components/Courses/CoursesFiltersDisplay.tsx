import type { Dispatch, SetStateAction } from "react";
import {
	GuidesFiltersValues,
	type FiltersQuery,
} from "../PracticalGuides/GuidesFiltersDisplay";
import FiltersGroup from "../ui/SearchPage/FiltersGroup";
import { COURSE_FORMATS } from "~/utils/courses";

export const CoursesFiltersDisplay = ({
	setFilters,
}: {
	setFilters: Dispatch<SetStateAction<FiltersQuery>>;
}) => {
	const filters = GuidesFiltersValues();

	filters.push({
		label: "Format",
		collection: "formats",
		value: COURSE_FORMATS.map(({ value, label }) => ({ slug: value, label })),
	});

	return <FiltersGroup filters={filters} setFilters={setFilters} />;
};
