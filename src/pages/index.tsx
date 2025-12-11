import Head from "next/head";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import { PersonaTiles } from "~/components/Accueil/PersonaTiles";

export default function Home() {
  const { classes } = useStyles();

  const tiles = [
    {
      title: "Je suis une personne concernée",
      description: "Description type",
    },
    {
      title: "Je suis un parent proche",
      description: "Description type",
    },
    {
      title: "Je suis un professionnel",
      description: "Description type",
    },
    {
      title: "Autres",
      description: "Description type",
    },
  ];

  return (
    <>
      <Head>
        <title>DITND - Accueil</title>
      </Head>
      <div>
        <div className={fr.cx("fr-pt-4w", "fr-pb-4w")}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
              <h1>Autisme et troubles du neuro-développement</h1>
              <p>
                La plateforme nationale au services des personnes concernées par
                un trouble du neurodéveloppement, les parents, et les
                professionnels.
              </p>
            </div>
          </div>
        </div>
        <div className={fr.cx("fr-pt-4w", "fr-pb-4w")}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-12")}>
              <h2>Qui êtes vous</h2>
              <div className={fr.cx("fr-text--sm")}>
                La plateforme nationale au services des personnes concernées par
                un trouble du neurodéveloppement
              </div>
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
              {tiles.map((tile, index) => (
                <PersonaTiles key={index} tile={tile} />
              ))}
            </div>
          </div>
        </div>
        <div className={fr.cx("fr-pt-4w", "fr-pb-4w")}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-12")}>
              <h2>Fiches pratiques les plus lues</h2>
              <div className={fr.cx("fr-text--sm")}>
                La plateforme nationale au services des personnes concernées par
                un trouble du neurodéveloppement
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const useStyles = tss.withName(Home.name).create({
  tileContainer: {
    width: "100%",
    backgroundColor: fr.colors.decisions.background.alt.grey.default,
  },
});
