import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import { type PersonaTile } from "../../HomePage/PersonaTiles";
import { type PersonaTypes } from "../../HomePage/PersonaTiles";
export const PersonaGrid = ({
  tiles,
  onClick,
}: {
  tiles: PersonaTile[];
  onClick: Record<PersonaTypes, () => void>;
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
            onClick: onClick[tile.display],
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
