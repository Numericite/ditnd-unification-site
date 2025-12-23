import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import { type PersonaTile, type TagItem } from "../../HomePage/PersonaTiles";
import { type PersonaTypes } from "../../HomePage/PersonaTiles";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  tiles: PersonaTile[];
  onClick: Record<PersonaTypes, () => void>;
  setTags: Dispatch<SetStateAction<TagItem[]>>;
};

export const PersonaGrid = ({ tiles, onClick, setTags }: Props) => (
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
        style={{
          alignItems: "stretch",
          marginLeft: 0,
        }}
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
                  display: "default",
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
