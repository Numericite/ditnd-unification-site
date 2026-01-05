import { api } from "~/utils/api";
import { PracticalGuide } from "../ui/PracticalGuides/PracticalGuide";
import { fr } from "@codegouvfr/react-dsfr";
import type { FiltersQuery } from "./FiltersDisplay";
import { useState } from "react";
import { SearchBarUI } from "../ui/PracticalGuides/SearchBarUI";

export type DisplayItem = {
  id: number;
  name: string;
  slug: string;
  textColor: string;
  backgroundColor: string;
};

export type GuidesItems = {
  id: number;
  title: string;
  slug: string;
  description: string;
  condition?: DisplayItem;
  persona?: DisplayItem;
  theme?: DisplayItem;
};

export const PracticalGuidesDisplay = ({
  filters,
}: {
  filters: FiltersQuery;
}) => {
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
        <div className="">...Loading</div>
      ) : (
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          {practicalGuideData?.map((guide) => (
            <div
              key={guide.id}
              className={fr.cx("fr-col-12", "fr-col-md-6")}
              style={{ display: "flex" }}
            >
              <PracticalGuide
                title={guide.title}
                slug={guide.slug}
                badge={guide.theme?.name ?? ""}
                description={guide.description}
                condition={guide.condition?.slug ?? ""}
                textColor={guide.condition?.textColor ?? ""}
                backgroundColor={guide.condition?.backgroundColor ?? ""}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
