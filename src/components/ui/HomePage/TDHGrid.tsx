import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import { type TDH } from "~/state/store";

export const TDHGrid = ({
  tiles,
  onClick,
}: {
  tiles: TDH[];
  onClick: () => void;
}) => (
  <>
    {tiles.map((tdh) => (
      <div
        key={tdh.id}
        className={fr.cx(
          "fr-col-12",
          "fr-col-sm-6",
          "fr-col-md-4",
          "fr-col-lg-3"
        )}
      >
        <Tile
          key={tdh.id}
          enlargeLinkOrButton
          buttonProps={{
            onClick: onClick,
          }}
          orientation="vertical"
          title={tdh.name}
          detail={tdh.description}
          titleAs="h3"
        />
      </div>
    ))}
  </>
);
