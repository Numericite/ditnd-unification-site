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
import { tss } from "tss-react";
import ChatBot from "~/components/Chatbot/Chatbot";
import "~/utils/styles/keyframes.css";
import MainNavigation from "~/components/ui/Navigation/MainNavigation";
import { useRouter } from "next/router";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";

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

	const router = useRouter();

	const { displayTmpChatbot } = router.query as { displayTmpChatbot?: string };

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
				<title>DITND</title>
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

				{displayTmpChatbot === "true" && <ChatBot />}

				<Footer
					id="footer"
					accessibility="non compliant"
					contentDescription={footerTitle}
					accessibilityLinkProps={{
						href: "/accessibility",
					}}
					termsLinkProps={{
						href: "/legalNotice",
					}}
					bottomItems={[
						{
							text: "Données personnelles",
							linkProps: { href: "/cgu" },
						},
						{
							text: "Modalités d’utilisation",
							linkProps: { href: "/termsOfUse" },
						},
						{
							text: "Code source",
							linkProps: {
								href: "https://github.com/Numericite/ditnd-unification-site",
								title: "Code source, nouvelle fenêtre",
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
});

export default withDsfr(api.withTRPC(withAppEmotionCache(App)));
