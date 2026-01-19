import type { Dispatch, SetStateAction } from "react";
import {
	GuidesFiltersValues,
	type FiltersQuery,
} from "../PracticalGuides/GuidesFiltersDisplay";
import { Filter } from "../ui/SearchPage/Filter";

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

	const handleOnChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		collection: keyof FiltersQuery,
	) => {
		const slug = e.target.value;
		const checked = e.target.checked;

		setFilters((prev) => {
			const current = prev[collection];
			if (!current) return { ...prev };
			return {
				...prev,
				[collection]: checked
					? [...current, slug]
					: current.filter((value) => value !== slug),
			};
		});
	};

	return (
		<>
			{filters?.map((filter, index) => (
				<Filter
					key={`filter${index}`}
					label={filter.label}
					value={filter.value}
					handleOnChange={(e) => handleOnChange(e, filter.collection)}
				/>
			))}
		</>
	);
};
