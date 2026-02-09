import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import type { FiltersQuery } from "./GuidesFiltersDisplay";
import { useState } from "react";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { Loader } from "../ui/Loader";
import CardsDisplayGroup from "../ui/Cards/CardsDisplayGroup";
import { useSearchParams } from "next/navigation";
import { EmptyScreenZone } from "../ui/EmptyScreenZone";

export const SearchGuidesDisplay = ({ filters }: { filters: FiltersQuery }) => {
	const searchParams = useSearchParams();

	const search = searchParams?.get("search");

	const [query, setQuery] = useState<string>(search ?? "");

	const { data: practicalGuideData, isLoading: isLoadingGuides } =
		api.practicalGuide.getByFilters.useQuery({ ...filters, text: query });

	return (
		<>
			<SearchBarUI value={query} onClick={(query) => setQuery(query)} />
			{isLoadingGuides ? (
				<EmptyScreenZone>
					<Loader />
				</EmptyScreenZone>
			) : practicalGuideData?.length === 0 || !practicalGuideData ? (
				<div className={fr.cx("fr-my-2w")}>Aucune fiche pratique trouvée</div>
			) : (
				<div
					className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-pt-3w")}
					id="contenu"
				>
					<CardsDisplayGroup
						className={fr.cx("fr-col-lg-6")}
						guides={practicalGuideData}
						kind="guides"
					/>
				</div>
			)}
		</>
	);
};
