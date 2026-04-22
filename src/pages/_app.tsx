import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { createNextDsfrIntegrationApi } from "@codegouvfr/react-dsfr/next-pagesdir";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { createEmotionSsrAdvancedApproach } from "tss-react/next/pagesDir";
import { api } from "~/utils/api";
import { homeCMSStore, personStore, proStore, tdhStore } from "~/state/store";
import { Loader } from "~/components/ui/Loader";
import { tss } from "tss-react/dsfr";
import ChatBot from "~/components/Chatbot/Chatbot";
import "~/utils/styles/keyframes.css";
import MainNavigation from "~/components/ui/Navigation/MainNavigation";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { fr } from "@codegouvfr/react-dsfr";

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

function App({ Component, pageProps }: AppProps) {
  const { classes, cx } = useStyles();

  const { data: conditions, isLoading: isLoadingHomePage } =
    api.condition.all.useQuery();

  const { data: persons, isLoading: isLoadingPersons } =
    api.persona.persons.useQuery();

  const { data: homeCMS, isLoading: isLoadingHomeCMS } =
    api.cms.home.useQuery();

  const { data: footerTitle, isLoading: isLoadingFooterTitle } =
    api.cms.footerTitle.useQuery();

  const { data: professionalPersonas, isLoading: isLoadingPersona } =
    api.persona.professionals.useQuery();

  if (homeCMS && !isLoadingHomeCMS) homeCMSStore.set(homeCMS);

  if (professionalPersonas) proStore.set(professionalPersonas);
  if (persons) personStore.set(persons);

  tdhStore.set(conditions);

  return (
    <>
      <Head>
        <title>
          Maison de l'autisme - Informations sur l'autisme et les troubles du
          neurodéveloppement
        </title>
      </Head>
      <div className={cx(classes.headerContainer)}>
        <MainNavigation />

        <main id="main">
          {isLoadingHomePage ||
          isLoadingPersona ||
          isLoadingFooterTitle ||
          isLoadingPersons ? (
            <EmptyScreenZone>
              <Loader />
            </EmptyScreenZone>
          ) : (
            <Component {...pageProps} />
          )}
        </main>

        <div className={cx(classes.chatBotsWrapper)}>
          <ChatBot />
        </div>

        <Footer
          id="footer"
          className={cx(classes.footer)}
          accessibility="non compliant"
          contentDescription={footerTitle}
          websiteMapLinkProps={{
            href: "/plan-du-site",
          }}
          accessibilityLinkProps={{
            href: "/accessibilite",
          }}
          termsLinkProps={{
            href: "/mentions-legales",
          }}
          bottomItems={[
            {
              text: "Données personnelles",
              linkProps: { href: "/donnees-personnelles" },
            },
            {
              text: "Code source",
              linkProps: {
                href: "https://github.com/Numericite/ditnd-unification-site",
                title: "Code source, nouvelle fenêtre",
              },
            },
            {
              text: "Contact particuliers",
              linkProps: {
                href: "https://www.autismeinfoservice.fr/contact",
                title: "Contact particuliers, nouvelle fenêtre",
                target: "_blank",
                rel: "noopener noreferrer",
              },
            },
            headerFooterDisplayItem,
          ]}
        />
      </div>
    </>
  );
}

const useStyles = tss.withName(App.name).create({
  headerContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  megaMenuCustom: {
    ".fr-menu__list": {
      position: "relative",
    },
    ".fr-collapse": {
      overflow: "visible",
      "&:is(.fr-collapsing)": {
        overflow: "hidden",
      },
    },
  },
  chatBotsWrapper: {
    position: "fixed",
    bottom: fr.spacing("2w"),
    right: fr.spacing("3w"),
    display: "flex",
    justifyContent: "end",
    alignItems: "flex-end",
    gap: fr.spacing("2v"),
    zIndex: 1100,
    pointerEvents: "none",
    "& > *": {
      pointerEvents: "auto",
    },
    [fr.breakpoints.down("md")]: {
      bottom: 0,
      right: 0,
      left: 0,
    },
  },
  footer: {
    [fr.breakpoints.down("md")]: {
      paddingBottom: fr.spacing("10v"),
    },
  },
});

export default withDsfr(api.withTRPC(withAppEmotionCache(App)));
