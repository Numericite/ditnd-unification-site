import type { Dispatch, SetStateAction } from "react";
import {
	GuidesFiltersValues,
	type FiltersType,
} from "../PracticalGuides/GuidesFiltersDisplay";
import FiltersGroup from "../ui/SearchPage/FiltersGroup";
import { COURSE_DURATIONS, COURSE_FORMATS } from "~/utils/courses";
import type { CoursesFiltersQuery } from "./SearchCoursesDisplay";

export const CoursesFiltersDisplay = ({
	setFilters,
}: {
	setFilters: Dispatch<SetStateAction<CoursesFiltersQuery>>;
}) => {
	const filters: FiltersType<CoursesFiltersQuery>[] = [
		...GuidesFiltersValues(),
		{
			label: "Format",
			collection: "formats",
			value: COURSE_FORMATS.map(({ value, label }) => ({ slug: value, label })),
		},
		{
			label: "Durée",
			collection: "durations",
			value: COURSE_DURATIONS.map(({ value, label }) => ({
				slug: value,
				label,
			})),
		},
	];

	return <FiltersGroup filters={filters} setFilters={setFilters} />;
};
