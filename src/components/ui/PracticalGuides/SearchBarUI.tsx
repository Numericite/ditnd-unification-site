import { fr } from "@codegouvfr/react-dsfr";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { useState } from "react";
import { api } from "~/utils/api";

export const SearchBarUI = () => {
  return (
    <div className={fr.cx("fr-grid-row")}>
      <div className={fr.cx("fr-mb-2w", "fr-col-12")}>
        <SearchBar
          label="Rechercher un sujet, une thématique..."
          big
          onButtonClick={function noRef() {}}
        />
      </div>
    </div>
  );
};
