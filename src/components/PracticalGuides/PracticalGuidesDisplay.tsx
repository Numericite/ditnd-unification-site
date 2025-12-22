import { api } from "~/utils/api";
import { PracticalGuide } from "../ui/PracticalGuides/PracticalGuide";
import { fr } from "@codegouvfr/react-dsfr";

export type DisplayItem = {
  id: number;
  name: string;
  slug: string;
};

export type GuidesItems = {
  id: number;
  title: string;
  description: string;
  condition?: DisplayItem;
  persona?: DisplayItem;
  theme?: DisplayItem;
};

export const PracticalGuidesDisplay = () => {
  const { data: practicalGuideData, isLoading: isLoadingGuides } =
    api.practicalGuide.display.useQuery();
  const { data: filteredPracticalGuides, isLoading: isLoadingFiltered } =
    api.practicalGuide.getByFilters.useQuery({ text: "aaaa" });

  return (
    <>
      {isLoadingGuides ? (
        <div className="">...Loading</div>
      ) : (
        practicalGuideData?.map((guide) => (
          <div
            key={guide.id}
            className={fr.cx("fr-col-12", "fr-col-md-6")}
            style={{ display: "flex" }}
          >
            <PracticalGuide
              title={guide.title}
              badge={guide.theme?.name ?? ""}
              description={guide.description}
              condition={guide.condition?.slug ?? ""}
            />
          </div>
        ))
      )}
    </>
  );
};
