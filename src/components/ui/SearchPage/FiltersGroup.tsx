import type {
	FiltersQuery,
	FiltersType,
} from "~/components/PracticalGuides/GuidesFiltersDisplay";
import { Filter } from "./Filter";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { toArray } from "~/utils/tools";

type Props = {
	filters: FiltersType[];
	setFilters: Dispatch<SetStateAction<FiltersQuery>>;
};

export default function FiltersGroup({ filters, setFilters }: Props) {
	const router = useRouter();

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

		const currentQueryValues = toArray(router.query[collection]);

		const nextValues = checked
			? [...currentQueryValues, slug]
			: currentQueryValues.filter((value) => value !== slug);

		const nextQuery = { ...router.query };

		if (nextValues.length > 0) {
			nextQuery[collection] = nextValues;
		} else {
			delete nextQuery[collection];
		}

		router.push(
			{
				pathname: router.pathname,
				query: nextQuery,
			},
			undefined,
			{ shallow: true },
		);
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
