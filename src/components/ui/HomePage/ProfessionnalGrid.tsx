import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import {
  type PersonaTile,
  type PersonaTypes,
  type TagItem,
} from "../../HomePage/PersonaTiles";
import type { Dispatch, SetStateAction } from "react";

export const ProfessionnalGrid = ({
  tiles,
  onClick,
  setTags,
}: {
  tiles: PersonaTile[];
  onClick: Record<PersonaTypes, () => void>;
  setTags: Dispatch<SetStateAction<TagItem[]>>;
}) => (
  <>
    {tiles.map((tile, index) => (
      <div
        key={index}
        className={fr.cx(
          "fr-col-12",
          "fr-col-sm-6",
          "fr-col-md-4",
          "fr-col-lg-3"
        )}
      >
        <Tile
          enlargeLinkOrButton
          buttonProps={{
            onClick: () => {
              onClick[tile.display]();
              setTags((prev) => [
                ...prev,
                {
                  label: tile.name,
                  slug: tile.slug,
                  display: "professionnal",
                },
              ]);
            },
          }}
          orientation="vertical"
          title={tile.name}
          detail={tile.description}
          titleAs="h3"
        />
      </div>
    ))}
  </>
);
