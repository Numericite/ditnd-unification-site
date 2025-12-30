import { fr } from "@codegouvfr/react-dsfr";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { useState } from "react";

type Props = {
  onClick: (query: string) => void;
};

export const SearchBarUI = ({ onClick }: Props) => {
  const [search, onSearchChange] = useState("");

  return (
    <div className={fr.cx("fr-grid-row")}>
      <div className={fr.cx("fr-mb-2w", "fr-col-12")}>
        <SearchBar
          label="Rechercher un sujet, une thématique..."
          big
          onButtonClick={() => {
            onClick(search);
          }}
          renderInput={({ className, id, placeholder, type }) => (
            <input
              className={className}
              id={id}
              placeholder={placeholder}
              type={type}
              value={search}
              onChange={(event) => {
                if (event.currentTarget.value === "") onClick("");
                onSearchChange(event.currentTarget.value);
              }}
            />
          )}
        />
      </div>
    </div>
  );
};
