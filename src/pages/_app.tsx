import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { createNextDsfrIntegrationApi } from "@codegouvfr/react-dsfr/next-pagesdir";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { createEmotionSsrAdvancedApproach } from "tss-react/next/pagesDir";
import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";

declare module "@codegouvfr/react-dsfr/next-pagesdir" {
  interface RegisterLink {
    Link: typeof Link;
  }
}

const { augmentDocumentWithEmotionCache, withAppEmotionCache } =
  createEmotionSsrAdvancedApproach({ key: "css" });

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
  defaultColorScheme: "system",
  Link,
  preloadFonts: [
    //"Marianne-Light",
    //"Marianne-Light_Italic",
    "Marianne-Regular",
    //"Marianne-Regular_Italic",
    "Marianne-Medium",
    //"Marianne-Medium_Italic",
    "Marianne-Bold",
    //"Marianne-Bold_Italic",
    //"Spectral-Regular",
    //"Spectral-ExtraBold"
  ],
});

export { augmentDocumentWithEmotionCache, dsfrDocumentApi };

const userNavigationItems: MainNavigationProps.Item[] = [
  { text: "Accueil", linkProps: { href: "/" } },
  {
    menuLinks: [
      {
        linkProps: {
          href: "#",
        },
        text: "Une personne concernée",
      },
      {
        linkProps: {
          href: "#",
        },
        text: "Un parent",
      },
      {
        linkProps: {
          href: "#",
        },
        text: "Un professionnel",
      },
      {
        linkProps: {
          href: "#",
        },
        text: "Autres",
      },
    ],
    text: "Je suis",
  },
  { text: "Fiches pratiques", linkProps: { href: "/fiches" } },
  {
    menuLinks: [
      {
        linkProps: {
          href: "#",
        },
        text: "PH LINK",
      },
    ],
    text: "Formations",
  },
  { text: "Actualités", linkProps: { href: "/actualite" } },
  { text: "Annuaire", linkProps: { href: "/annuaire" } },
  {
    menuLinks: [
      {
        linkProps: {
          href: "#",
        },
        text: "PH LINK",
      },
    ],
    text: "À propos",
  },
];

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const navigationItems = userNavigationItems.map((item) => ({
    ...item,
    isActive: router.asPath === item?.linkProps?.href,
  }));

  return (
    <>
      <Head>
        <title>DITND</title>
      </Head>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          brandTop={
            <>
              RÉPUBLIQUE
              <br />
              FRANÇAISE
            </>
          }
          homeLinkProps={{
            href: "/",
            title: "Accueil DITND",
          }}
          id="fr-header-with-horizontal-operator-logo"
          navigation={navigationItems}
          quickAccessItems={[
            {
              iconId: "fr-icon-add-circle-line",
              linkProps: {
                href: "#",
              },
              text: "Besoin de vérifier une information ?",
            },
            <Button
              id="button-question"
              iconId={"fr-icon-message-2-line"}
              aria-label={`Ouvrir le menu mon compte`}
              priority="secondary"
              size="large"
            >
              Posez votre question
            </Button>,
          ]}
          serviceTitle="DI-TND"
          serviceTagline="Délégation interministérielle pour les troubles du neurodéveloppement"
        />

        <main className={fr.cx("fr-container")} style={{ flex: 1 }}>
          <Breadcrumb
            currentPageLabel=""
            homeLinkProps={{
              href: "/",
            }}
            segments={[]}
          />
          <Component {...pageProps} />
        </main>
        <Footer
          accessibility="non compliant"
          bottomItems={[headerFooterDisplayItem]}
        />
      </div>
    </>
  );
}

export default withDsfr(api.withTRPC(withAppEmotionCache(App)));
