import Head from "next/head";
import { tss } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import { PersonaTiles } from "~/components/HomePage/PersonaTiles";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { api } from "~/utils/api";
import MostViewedGuides from "~/components/HomePage/MostViewedGuides";
import { Loader } from "~/components/ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { homeCMSStore, personStore } from "~/state/store";
import { personsAndProTiles } from "~/utils/tools";
import Image from "next/image";

export default function Home() {
  const { classes, cx } = useStyles();

  const [search, setSearch] = useState("");

  const router = useRouter();

  const { data: mostViewedGuides, isLoading: isLoadingViewedGuides } =
    api.practicalGuide.getByViews.useQuery();

  const persons = personStore.get();

  const homeCMS = homeCMSStore.get();

  const tiles = personsAndProTiles(persons);

  if (isLoadingViewedGuides || !persons)
    return (
      <EmptyScreenZone>
        <Loader />
      </EmptyScreenZone>
    );

  if (!homeCMS)
    return (
      <EmptyScreenZone>
        <p>
          Erreur lors du chargement des variables globales sur payload CMS,
          veuillez revoir la configuration de votre instance Payload.{" "}
        </p>
      </EmptyScreenZone>
    );

  return (
    <>
      <Head>
        <title>Maison de l'autisme - Accueil</title>
        <meta
          name="description"
          content="Maison de l'autisme : site national d'informations pour toutes les personnes concernées par l'autisme et ses troubles associés. Retrouvez des ressources, diagnostics et formations."
        />
      </Head>
      <div>
        <div className={fr.cx("fr-container", "fr-my-8w")}>
          <div className={fr.cx("fr-py-4w")}>
            <div
              className={cx(
                fr.cx("fr-grid-row", "fr-grid-row--gutters"),
                classes.headerRow,
              )}
            >
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <h1>{homeCMS.header.title}</h1>
                <p className={classes.preLine}>
                  {homeCMS.header.description}
                </p>
                <SearchBar
                  id="search-global"
                  big
                  onButtonClick={() => router.push(`/recherche?search=${search}`)}
                  renderInput={({ className, id, placeholder, type }) => (
                    <input
                      className={className}
                      id={id}
                      placeholder={placeholder}
                      type={type}
                      value={search}
                      onChange={(event) => {
                        if (event.currentTarget.value === "") setSearch("");
                        setSearch(event.currentTarget.value);
                      }}
                    />
                  )}
                />
              </div>
              <div
                className={cx(
                  fr.cx("fr-col-12", "fr-col-md-6"),
                  classes.headerImageContainer,
                )}
              >
                <Image
                  alt=""
                  width={400}
                  height={400}
                  fetchPriority="high"
                  priority
                  loading="eager"
                  src={"/HomePageIllustration.svg"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={cx(classes.coloredContainer)} id="who">
          <div className={fr.cx("fr-container")}>
            <div className={fr.cx("fr-py-6w")}>
              {persons ? (
                <PersonaTiles tiles={tiles} />
              ) : (
                <div role="alert" aria-live="assertive">Aucun persona trouvé</div>
              )}
            </div>
          </div>
        </div>
        <div className={fr.cx("fr-container")}>
          <div className={fr.cx("fr-py-4w")}>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div
                className={cx(fr.cx("fr-col-12"), classes.mostViewedContainer)}
                id="mostViewed"
              >
                <h2>{homeCMS?.mostViewedGuides.title}</h2>
                <div
                  className={cx(fr.cx("fr-text--sm"), classes.preLine)}
                >
                  {homeCMS?.mostViewedGuides.description}
                </div>

                {mostViewedGuides?.length === 0 || !mostViewedGuides ? (
                  <div role="alert" aria-live="assertive">Aucune fiche pratique trouvée</div>
                ) : (
                  <MostViewedGuides guides={mostViewedGuides} />
                )}

                <a
                  href="/fiches-pratiques"
                  className={cx(
                    fr.cx(
                      "fr-link",
                      "fr-icon-arrow-right-line",
                      "fr-link--icon-right",
                    ),
                    classes.viewMoreLink,
                  )}
                >
                  Voir toutes les fiches par thématiques
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const useStyles = tss.withName(Home.name).create({
  headerRow: {
    alignContent: "center",
    alignItems: "center",
  },
  headerImageContainer: {
    display: "flex",
    justifyContent: "center",
    [fr.breakpoints.down("md")]: {
      display: "none",
    },
  },
  preLine: {
    whiteSpace: "pre-line",
  },
  coloredContainer: {
    backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
  },
  mostViewedContainer: {
    display: "flex",
    flexDirection: "column",
  },
  viewMoreLink: {
    marginLeft: "auto",
    marginTop: fr.spacing("3w"),
  },
});
