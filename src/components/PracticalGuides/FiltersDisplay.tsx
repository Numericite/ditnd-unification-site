import { Filter } from "../ui/PracticalGuides/Filter";
import { useObservable } from "@legendapp/state/react";
import type { Dispatch, SetStateAction } from "react";
import { tdhStore } from "~/state/store";
import { api } from "~/utils/api";

export type FilterItem = {
	id: string | number;
	label: string;
};

export type FiltersQuery = {
	conditions: string[];
	themes: string[];
	personas: string[];
};

export const FiltersDisplay = ({
	setFilters,
}: {
	setFilters: Dispatch<SetStateAction<FiltersQuery>>;
}) => {
	const tdh = useObservable(tdhStore).get();

	const { data: personasData, isLoading: isLoadingPersonas } =
		api.persona.all.useQuery();

	const { data: themesData, isLoading: isLoadingThemes } =
		api.theme.all.useQuery();

	const tdhItems: FilterItem[] = tdh.get().map((condition) => ({
		id: condition.slug,
		label: condition.name,
	}));

	const personaItems: FilterItem[] =
		personasData?.map((persona) => ({
			id: persona.slug,
			label: persona.name,
		})) ?? [];

	const themeItems: FilterItem[] =
		themesData?.map((theme) => ({
			id: theme.slug,
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

	return (
		<>
			{!isLoadingPersonas &&
				!isLoadingThemes &&
				tdh &&
				filters.map((filter, index) => (
					<Filter
						key={`filter${index}`}
						label={filter.label}
						collection={filter.collection}
						value={filter.value}
						setFilters={setFilters}
					/>
				))}
		</>
	);
};
