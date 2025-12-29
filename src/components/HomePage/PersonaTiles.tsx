import { fr } from "@codegouvfr/react-dsfr";
import { useState } from "react";
import { useObservable } from "@legendapp/state/react";
import { tdhStore, type TDH } from "~/state/store";
import { PersonaGrid } from "../ui/HomePage/PersonaGrid";
import { api } from "~/utils/api";
import Tag from "@codegouvfr/react-dsfr/Tag";

export type PersonaTypes =
  | "person"
  | "professional"
  | "afterProfessional"
  | "condition"
  | "default";

export type PersonaTile = {
  id?: number;
  name: string;
  description: string;
  slug: string;
  display: PersonaTypes;
};

export type TagItem = {
  label: string;
  display: PersonaTypes;
  slug: string;
};

const unknownTile: TDH = {
  name: "Un trouble que je ne sais pas identifier",
  description: "Diagnostic rapide de vos symptômes pour mieux vous comprendre",
  acronym: "unknown",
  slug: "unknown",
  display: "condition",
};

export const PersonaTiles = ({ tiles }: { tiles: PersonaTile[] }) => {
  const [display, setDisplay] = useState<PersonaTypes>("default");
  const [tags, setTags] = useState<TagItem[]>([]);

  const { data: professionalPersonas, isLoading: isLoadingPro } =
    api.persona.professionals.useQuery();

  const tdh = useObservable(tdhStore).get();

  const tdhTiles = [unknownTile, ...tdh.get()];

  const tileDispatchTable: Record<PersonaTypes, () => void> = {
    person: () => {
      setDisplay("person");
    },
    professional: () => {
      setDisplay("professional");
    },
    afterProfessional: () => {
      setDisplay("afterProfessional");
    },
    condition: () => {
      console.log(tags);
      setTags([]);
      setDisplay("default");
    },
    default: () => {
      setDisplay("default");
    },
  };

  const renderContent = () => {
    switch (display) {
      case "person":
        if (!tdhTiles) return <div>Loading...</div>;
        return (
          <PersonaGrid
            tiles={tdh.get()}
            onClick={tileDispatchTable}
            currentDisplay="professional"
          />
        );

      case "professional":
        if (isLoadingPro) return <div>Loading...</div>;
        if (!professionalPersonas)
          return <div>No professional persona found</div>;

        return (
          <PersonaGrid
            tiles={professionalPersonas}
            onClick={tileDispatchTable}
            setTags={setTags}
            currentDisplay="professional"
          />
        );

      case "afterProfessional":
        return (
          <PersonaGrid
            tiles={tdh.get()}
            onClick={tileDispatchTable}
            currentDisplay="professional"
          />
        );

      default:
        return (
          <PersonaGrid
            tiles={tiles}
            onClick={tileDispatchTable}
            setTags={setTags}
            currentDisplay="default"
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
                  tag.display === "default"
                    ? setTags([])
                    : setTags([...tags].filter((t) => t.slug !== tag.slug));
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
