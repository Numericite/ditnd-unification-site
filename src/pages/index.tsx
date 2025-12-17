import Head from "next/head";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import { PersonaTiles } from "~/components/HomePage/PersonaTiles";
import { api } from "~/utils/api";
import { type PersonaTile } from "~/components/HomePage/PersonaTiles";
import { tdhStore } from "~/state/store";
import { PracticalGuides } from "~/components/HomePage/PracticalGuides";

export default function Home() {
  const { classes } = useStyles();

  const { data: conditions, isLoading: isLoadingHomePage } =
    api.condition.all.useQuery();

  tdhStore.set(conditions);

  const tiles: PersonaTile[] = [
    {
      name: "Je suis une personne concernée",
      description: "Description type",
      slug: "pe",
      display: "person",
    },
    {
      name: "Je suis un parent proche",
      description: "Description type",
      slug: "pp",
      display: "person",
    },
    {
      name: "Je suis un professionnel",
      description: "Description type",
      slug: "professionnal",
      display: "professionnal",
    },
    {
      name: "Autres",
      description: "Description type",
      slug: "gp",
      display: "person",
    },
  ];

  return (
    <>
      <Head>
        <title>DITND - Accueil</title>
      </Head>
      {isLoadingHomePage ? (
        <div className="">...Loading</div>
      ) : (
        <div>
          <div className={fr.cx("fr-py-4w")}>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
                <h1>Autisme et troubles du neuro-développement</h1>
                <p>
                  La plateforme nationale au services des personnes concernées
                  par un trouble du neurodéveloppement, les parents, et les
                  professionnels.
                </p>
              </div>
            </div>
          </div>
          <div className={fr.cx("fr-py-4w")}>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-12", "fr-col-lg-12")}>
                <h2>Qui êtes vous</h2>
                <div className={fr.cx("fr-text--sm")}>
                  La plateforme nationale au services des personnes concernées
                  par un trouble du neurodéveloppement
                </div>
              </div>
              <PersonaTiles tiles={tiles} />
            </div>
          </div>
          <div className={fr.cx("fr-py-4w")}>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-12", "fr-col-lg-12")}>
                <h2>Fiches pratiques les plus lues</h2>
                <div className={fr.cx("fr-text--sm")}>
                  La plateforme nationale au services des personnes concernées
                  par un trouble du neurodéveloppement
                </div>
              </div>
            </div>
            <PracticalGuides />
          </div>
        </div>
      )}
    </>
  );
}

const useStyles = tss.withName(Home.name).create({
  tileContainer: {
    width: "100%",
    backgroundColor: fr.colors.decisions.background.alt.grey.default,
  },
});
