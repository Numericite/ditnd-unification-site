import type {
	FiltersQuery,
	FiltersType,
} from "~/components/PracticalGuides/GuidesFiltersDisplay";
import { Filter } from "./Filter";
import type { Dispatch, SetStateAction } from "react";

type Props = {
	filters: FiltersType[];
	setFilters: Dispatch<SetStateAction<FiltersQuery>>;
};

export default function FiltersGroup({ filters, setFilters }: Props) {
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
}
