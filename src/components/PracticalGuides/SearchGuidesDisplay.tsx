import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import type { FiltersQuery } from "./GuidesFiltersDisplay";
import { useState } from "react";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { Loader } from "../ui/Loader";
import PracticalGuidesGroup from "../ui/PracticalGuides/PracticalGuidesGroup";

export const SearchGuidesDisplay = ({ filters }: { filters: FiltersQuery }) => {
	const [query, setQuery] = useState<string>("");

	const { data: practicalGuideData, isLoading: isLoadingGuides } =
		api.practicalGuide.getByFilters.useQuery({ ...filters, text: query });

	return (
		<>
			<SearchBarUI onClick={(query) => setQuery(query)} />
			{isLoadingGuides ? (
				<Loader />
			) : practicalGuideData?.length === 0 || !practicalGuideData ? (
				<div className={fr.cx("fr-my-2w")}>Aucune fiche pratique trouvée</div>
			) : (
				<div
					className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-pt-3w")}
				>
					<PracticalGuidesGroup
						className={fr.cx("fr-col-lg-6")}
						practicalGuides={practicalGuideData}
					/>
				</div>
			)}
		</>
	);
};
