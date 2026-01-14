import { api } from "~/utils/api";
import { PracticalGuide } from "../ui/PracticalGuides/PracticalGuide";
import { fr } from "@codegouvfr/react-dsfr";
import type { FiltersQuery } from "./FiltersDisplay";
import { useState } from "react";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { Loader } from "../ui/Loader";

export const SearchGuidesDisplay = ({ filters }: { filters: FiltersQuery }) => {
	const [query, setQuery] = useState<string>("");

	const { data: practicalGuideData, isLoading: isLoadingGuides } =
		api.practicalGuide.getByFilters.useQuery({ ...filters, text: query });

	return (
		<>
			<SearchBarUI
				onClick={(query) => {
					setQuery(query);
				}}
			/>
			{isLoadingGuides ? (
				<Loader />
			) : (
				<div
					className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-pt-3w")}
				>
					{practicalGuideData?.map((guide) => (
						<div
							key={guide.id}
							className={fr.cx("fr-col-12", "fr-col-md-6")}
							style={{ display: "flex" }}
						>
							<PracticalGuide
								title={guide.title}
								slug={guide.slug}
								badge={guide.theme[0]?.name}
								description={guide.description}
								conditions={guide.conditions}
							/>
						</div>
					))}
				</div>
			)}
		</>
	);
};
