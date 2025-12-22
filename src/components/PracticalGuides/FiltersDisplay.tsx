import { Filter } from "../ui/PracticalGuides/Filter";
import { useObservable } from "@legendapp/state/react";
import { tdhStore } from "~/state/store";
import { api } from "~/utils/api";

export type FilterItem = {
  id: string | number;
  label: string;
};

export const FiltersDisplay = () => {
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

  const filters = [
    { label: "Troubles", value: tdhItems },
    { label: "Thématiques", value: themeItems },
    { label: "À destination de", value: personaItems },
  ];

  return (
    <>
      {!isLoadingPersonas && !isLoadingThemes && !tdh ? (
        <></>
      ) : (
        filters.map((filter, index) => (
          <Filter
            key={"filter" + index}
            label={filter.label}
            value={filter.value}
          />
        ))
      )}
    </>
  );
};
