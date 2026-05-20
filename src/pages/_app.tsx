import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { createNextDsfrIntegrationApi } from "@codegouvfr/react-dsfr/next-pagesdir";
import NextApp, { type AppContext, type AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { createEmotionSsrAdvancedApproach } from "tss-react/next/pagesDir";
import { api } from "~/utils/api";
import {
	footerTitleStore,
	homeCMSStore,
	personStore,
	proStore,
	tdhStore,
} from "~/state/store";
import { tss } from "tss-react/dsfr";
import ChatBot from "~/components/Chatbot/Chatbot";
import "~/utils/styles/keyframes.css";
import MainNavigation from "~/components/ui/Navigation/MainNavigation";
import SeoMeta from "~/components/ui/SeoMeta";
import { fr } from "@codegouvfr/react-dsfr";
import type { GlobalData } from "~/server/global-data";

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

type AppPropsWithGlobal = AppProps & {
	pageProps: AppProps["pageProps"] & { globalData?: GlobalData };
};

function seedStoresFromGlobalData(globalData: GlobalData) {
	homeCMSStore.set(globalData.homeCMS);
	personStore.set(globalData.persons);
	proStore.set(globalData.professionals);
	tdhStore.set(globalData.conditions);
	footerTitleStore.set(globalData.footerTitle);
}

function App({ Component, pageProps }: AppPropsWithGlobal) {
	const { classes, cx } = useStyles();
	const router = useRouter();

	if (pageProps.globalData) {
		seedStoresFromGlobalData(pageProps.globalData);
	}

	useEffect(() => {
		const handleRouteChange = () => {
			document.getElementById("contenu")?.focus({ preventScroll: true });
		};
		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	const footerTitle =
		pageProps.globalData?.footerTitle ?? footerTitleStore.get();

	return (
		<>
			<SeoMeta
				title="Maison de l'autisme - Informations sur l'autisme et les troubles du neurodéveloppement"
				description="Site national d'informations pour toutes les personnes concernées par l'autisme et les troubles du neurodéveloppement. Retrouvez des ressources, diagnostics et formations."
				pathname={router.asPath}
			/>
			<div className={cx(classes.headerContainer)}>
				<MainNavigation />

				<main>
					<Component {...pageProps} />
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
							text: "Code source",
							linkProps: {
								href: "https://github.com/Numericite/ditnd-unification-site",
								"aria-label": "Code source, nouvelle fenêtre",
								title: "Code source, nouvelle fenêtre",
								target: "_blank",
								rel: "noopener noreferrer",
							},
						},
						{
							text: "Contact particuliers",
							linkProps: {
								href: "https://www.autismeinfoservice.fr/contact",
								"aria-label": "Contact particuliers, nouvelle fenêtre",
								title: "Contact particuliers, nouvelle fenêtre",
								target: "_blank",
								rel: "noopener noreferrer",
							},
						},
						{
							text: "Contact professionnels",
							linkProps: { href: "/contact-pros-cra" },
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

const WrappedApp = withDsfr(api.withTRPC(withAppEmotionCache(App)));

(
	WrappedApp as unknown as {
		getInitialProps: (ctx: AppContext) => Promise<unknown>;
	}
).getInitialProps = async (appContext: AppContext) => {
	const appProps = await NextApp.getInitialProps(appContext);

	if (typeof window !== "undefined") {
		return appProps;
	}

	let globalData: GlobalData | undefined;
	try {
		const { getGlobalData } = await import("~/server/global-data");
		globalData = await getGlobalData();
	} catch (err) {
		console.error("[_app.getInitialProps] global-data failed:", err);
	}

	return {
		...appProps,
		pageProps: {
			...appProps.pageProps,
			globalData,
		},
	};
};

export default WrappedApp;
