import type { Dispatch, SetStateAction } from "react";
import { tdhStore } from "~/state/store";
import { api } from "~/utils/api";
import FiltersGroup from "../ui/SearchPage/FiltersGroup";

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

export type FiltersType = {
	label: string;
	collection: keyof FiltersQuery;
	value: FilterItem[];
};

export const GuidesFiltersValues = () => {
	const tdh = tdhStore.get();

	const { data: personasData } = api.persona.all.useQuery();

	const { data: themesData } = api.theme.all.useQuery();

	const tdhItems: FilterItem[] = tdh.map((condition) => ({
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

	const filters: FiltersType[] = [
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

	return <FiltersGroup filters={filters} setFilters={setFilters} />;
};
