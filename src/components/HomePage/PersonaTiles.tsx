import { fr } from "@codegouvfr/react-dsfr";
import { useEffect, useState } from "react";
import { useObservable } from "@legendapp/state/react";
import { tdhStore, type TDH } from "~/state/store";
import { TDHGrid } from "../ui/HomePage/TDHGrid";
import { ProfessionnalGrid } from "../ui/HomePage/ProfessionnalGrid";
import { PersonaGrid } from "../ui/HomePage/PersonaGrid";
import { api } from "~/utils/api";

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

export const PersonaTiles = ({ tiles }: { tiles: PersonaTile[] }) => {
  const [display, setDisplay] = useState<DisplayType>("default");
  const [tdhTiles, setTDHTiles] = useState<TDH[]>();

  const unknownTile: TDH = {
    name: "Un trouble que je ne sais pas identifier",
    description:
      "Diagnostic rapide de vos symptômes pour mieux vous comprendre",
    acronym: "unknown",
    slug: "unknown",
  };

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
    switch (display) {
      case "person":
        if (!tdhTiles) {
          return <div>Loading...</div>;
        }
        return (
          <TDHGrid tiles={tdhTiles} onClick={() => setDisplay("default")} />
        );

      case "professionnal":
        if (isLoadingPro) {
          return <div>Loading...</div>;
        }

        if (!professionalPersonas) {
          return <div>No professional persona found</div>;
        }
        return (
          <ProfessionnalGrid
            tiles={professionalPersonas}
            onClick={tileDispatchTable}
          />
        );

      case "afterProfessional":
        return (
          <TDHGrid tiles={tdh.get()} onClick={() => setDisplay("default")} />
        );

      default:
        return <PersonaGrid tiles={tiles} onClick={tileDispatchTable} />;
    }
  };

  return (
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
  );
};
