import Head from "next/head";
import { tss } from "tss-react";
import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";

export default function Home() {
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>DITND - Accueil</title>
      </Head>
      <div className={classes.main}>
        <div className={fr.cx("fr-pt-1w", "fr-pb-4w")}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-7")}>
              <h1>Autisme et troubles du neuro-développement</h1>
              <p>
                La plateforme nationale au services des personnes concernées par
                un trouble du neurodéveloppement
              </p>
            </div>
          </div>
        </div>
        <div className={fr.cx("fr-pt-9w", "fr-pb-4w")}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-7")}>
              <h2>Qui êtes vous</h2>
              <p>
                La plateforme nationale au services des personnes concernées par
                un trouble du neurodéveloppement
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const useStyles = tss.withName(Home.name).create({
  main: {},
  container: {},
});
