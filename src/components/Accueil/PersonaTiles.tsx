import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";

type PersonaTiles = {
  title: string;
  description: string;
};

export const PersonaTiles = ({ tile }: { tile: PersonaTiles }) => {
  return (
    <div
      className={fr.cx(
        "fr-col-12",
        "fr-col-sm-6",
        "fr-col-md-4",
        "fr-col-lg-3"
      )}
    >
      <Tile
        enlargeLinkOrButton
        linkProps={{
          href: "#",
        }}
        orientation="vertical"
        title={tile.title}
        detail={tile.description}
        titleAs="h3"
      />
    </div>
  );
};
