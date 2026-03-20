"use client";

import { fr } from "@codegouvfr/react-dsfr";

export default function IconIdDescription() {
  return (
    <div className="field-description" style={{ display: "block" }}>
      Identifiant de l&apos;icône (ex: fr-icon-arrow-right-line, ri-alert-line).
      Voir{" "}
      <a
        href="https://www.systeme-de-design.gouv.fr/version-courante/fr/fondamentaux/icone#selection-d-icones"
        target="_blank"
        rel="noopener noreferrer"
      >
        Icônes DSFR
      </a>{" "}
      ou{" "}
      <a
        href="https://remixicon.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Remix Icon
      </a>
    </div>
  );
}
