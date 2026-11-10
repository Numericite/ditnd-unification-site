import type {
	FiltersQuery,
	FiltersType,
} from "~/components/PracticalGuides/GuidesFiltersDisplay";
import { Filter } from "./Filter";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { deserialize, serialize } from "~/utils/tools";
import {
	ALL_CONDITIONS_SLUG,
	withoutAllConditions,
} from "~/utils/conditions-filter";

type Props<Q extends FiltersQuery> = {
	filters: FiltersType<Q>[];
	setFilters: Dispatch<SetStateAction<Q>>;
};

// « Tous TND » et les troubles pris un à un s'excluent mutuellement : cocher
// l'un décoche les autres.
const computeNextValues = (
	current: string[],
	slug: string,
	checked: boolean,
	collection: string,
) => {
	if (!checked) return current.filter((value) => value !== slug);

	const next = [...new Set([...current, slug])];
	if (collection !== "conditions") return next;

	return slug === ALL_CONDITIONS_SLUG
		? [ALL_CONDITIONS_SLUG]
		: withoutAllConditions(next);
};

export default function FiltersGroup<Q extends FiltersQuery>({
	filters,
	setFilters,
}: Props<Q>) {
	const router = useRouter();

	const handleOnChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		collection: keyof Q & string,
	) => {
		const slug = e.target.value;
		const checked = e.target.checked;

		setFilters((prev) => ({
			...prev,
			[collection]: computeNextValues(
				prev[collection] as string[],
				slug,
				checked,
				collection,
			),
		}));

		const currentValues = deserialize(router.query[collection]);

		const nextValues = computeNextValues(
			currentValues,
			slug,
			checked,
			collection,
		);

		const nextQuery = { ...router.query };

		if (nextValues.length > 0) {
			nextQuery[collection] = serialize(nextValues);
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
					collection={filter.collection}
					value={filter.value}
					handleOnChange={(e) => handleOnChange(e, filter.collection)}
				/>
			))}
		</>
	);
}
