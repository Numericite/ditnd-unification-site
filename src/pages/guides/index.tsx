import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { FiltersDisplay } from "~/components/PracticalGuides/FiltersDisplay";
import { PracticalGuidesDisplay } from "~/components/PracticalGuides/PracticalGuidesDisplay";

export default function PracticalGuides() {
  return (
    <>
      <Head>
        <title>DITND - Fiches Pratiques</title>
      </Head>

      <div className={fr.cx("fr-container", "fr-my-6w")}>
        <h1 className={fr.cx("fr-mb-4w")}>Fiches pratiques</h1>

        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <aside
            className={fr.cx("fr-col-12", "fr-col-md-4")}
            style={{
              borderRight: "2px solid var(--border-default-grey)",
            }}
          >
            <div className={fr.cx("fr-p-3w")}>
              <p className={fr.cx("fr-h4")}>Affiner la recherche</p>
              <div className={fr.cx("fr-mt-2w")}>{<FiltersDisplay />}</div>
            </div>
          </aside>

          <main className={fr.cx("fr-col-12", "fr-col-md-8")}>
            <div className={fr.cx("fr-grid-row")}>
              <div className={fr.cx("fr-mb-2w", "fr-col-12")}>
                <SearchBar
                  label="Rechercher un sujet, une thématique..."
                  big
                  onButtonClick={function noRefCheck() {}}
                />
              </div>
            </div>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <PracticalGuidesDisplay />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
