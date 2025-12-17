import { fr } from "@codegouvfr/react-dsfr";
import { useEffect, useState } from "react";
import { useObservable } from "@legendapp/state/react";
import { tdhStore, type TDH } from "~/state/store";
import { TDHGrid } from "../ui/HomePage/TDHGrid";
import { ProfessionnalGrid } from "../ui/HomePage/ProfessionnalGrid";
import { PersonaGrid } from "../ui/HomePage/PersonaGrid";
import { api } from "~/utils/api";
import Tag from "@codegouvfr/react-dsfr/Tag";

export type PersonaTypes =
  | "person"
  | "parent"
  | "professionnal"
  | "afterProfessionnal"
  | "other";
export type DisplayType =
  | "default"
  | "person"
  | "professionnal"
  | "afterProfessional";

export type PersonaTile = {
  id?: number;
  name: string;
  description: string;
  slug: string;
  display: PersonaTypes;
};

export type TagItem = {
  label: string;
  display: DisplayType;
  slug: string;
};

const unknownTile: TDH = {
  name: "Un trouble que je ne sais pas identifier",
  description: "Diagnostic rapide de vos symptômes pour mieux vous comprendre",
  acronym: "unknown",
  slug: "unknown",
};

export const PersonaTiles = ({ tiles }: { tiles: PersonaTile[] }) => {
  const [display, setDisplay] = useState<DisplayType>("default");
  const [tdhTiles, setTDHTiles] = useState<TDH[]>();
  const [tags, setTags] = useState<TagItem[]>([]);

  const { data: professionalPersonas, isLoading: isLoadingPro } =
    api.persona.professionals.useQuery();

  const tdh = useObservable(tdhStore).get();

  useEffect(() => {
    const tilesWithUnknown: TDH[] = [unknownTile, ...tdh.get()];
    setTDHTiles(tilesWithUnknown);
  }, []);

  const handlePerson = () => {
    setDisplay("person");
  };

  const handleProfessionnal = () => {
    setDisplay("professionnal");
  };

  const handleAfterProfessionnal = () => {
    setDisplay("afterProfessional");
  };

  const tileDispatchTable: Record<PersonaTypes, () => void> = {
    person: handlePerson,
    parent: handlePerson,
    professionnal: handleProfessionnal,
    afterProfessionnal: handleAfterProfessionnal,
    other: handlePerson,
  };

  const renderContent = () => {
    if (!tdhTiles || isLoadingPro || !professionalPersonas) {
      return <div>Loading...</div>;
    }
    switch (display) {
      case "person":
        return (
          <TDHGrid tiles={tdhTiles} onClick={() => setDisplay("default")} /> //onclick placeholder so we do an api call after
        );

      case "professionnal":
        return (
          <ProfessionnalGrid
            tiles={professionalPersonas}
            onClick={tileDispatchTable}
            setTags={setTags}
          />
        );

      case "afterProfessional":
        return (
          <TDHGrid tiles={tdh.get()} onClick={() => setDisplay("default")} /> //onclick placeholder so we do an api call after
        );

      default:
        return (
          <PersonaGrid
            tiles={tiles}
            onClick={tileDispatchTable}
            setTags={setTags}
          />
        );
    }
  };

  return (
    <>
      <div
        className={fr.cx("fr-col-12", "fr-pb-2w")}
        style={{
          width: 800,
        }}
      >
        {tags ? (
          tags.map((tag, index) => (
            <Tag
              key={index}
              className={fr.cx("fr-mr-1w", "fr-mb-1w")}
              dismissible
              nativeButtonProps={{
                onClick: function deleteTag() {
                  setDisplay(tag.display);
                  setTags([...tags].filter((t) => t.slug !== tag.slug));
                },
              }}
            >
              {tag.label}
            </Tag>
          ))
        ) : (
          <></>
        )}
      </div>
      <div
        className={fr.cx(
          "fr-grid-row",
          "fr-grid-row--gutters",
          "fr-grid-row--middle"
        )}
        style={{
          width: "100%",
          alignItems: "stretch",
          marginLeft: 0,
        }}
      >
        {renderContent()}
      </div>
    </>
  );
};
