import { Filter } from "../ui/SearchPage/Filter";
import { useObservable } from "@legendapp/state/react";
import type { Dispatch, SetStateAction } from "react";
import { tdhStore } from "~/state/store";
import { api } from "~/utils/api";

export type FilterItem = {
	slug: string;
	label: string;
};

export interface FiltersQuery {
	conditions: string[];
	themes: string[];
	personas: string[];
	type?: string[];
}

export const GuidesFiltersValues = () => {
	const tdh = useObservable(tdhStore).get();

	const { data: personasData } = api.persona.all.useQuery();

	const { data: themesData } = api.theme.all.useQuery();

	const tdhItems: FilterItem[] = tdh.get().map((condition) => ({
		slug: condition.slug,
		label: condition.name,
	}));

	const personaItems: FilterItem[] =
		personasData?.map((persona) => ({
			slug: persona.slug,
			label: persona.name,
		})) ?? [];

	const themeItems: FilterItem[] =
		themesData?.map((theme) => ({
			slug: theme.slug,
			label: theme.name,
		})) ?? [];

	const filters: {
		label: string;
		collection: keyof FiltersQuery;
		value: FilterItem[];
	}[] = [
		{ label: "Troubles", collection: "conditions", value: tdhItems },
		{ label: "Thématiques", collection: "themes", value: themeItems },
		{ label: "À destination de", collection: "personas", value: personaItems },
	];

	return filters;
};

export const GuidesFiltersDisplay = ({
	setFilters,
}: {
	setFilters: Dispatch<SetStateAction<FiltersQuery>>;
}) => {
	const filters = GuidesFiltersValues();

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
