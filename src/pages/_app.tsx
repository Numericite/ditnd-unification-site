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
import { Button } from "@codegouvfr/react-dsfr/Button";
import { tdhStore } from "~/state/store";
import { Loader } from "~/components/ui/Loader";
import { tss } from "tss-react";
import { personas } from "~/utils/personas";
import SubMenuCustom from "~/components/ui/Navigation/SubMenuCustom";
import { useState } from "react";
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

	const router = useRouter();

	function isRouteActive(item: MainNavigationProps.Item, path: string) {
		const href = item.linkProps?.href;

		if (!href) return false;

		if (href === "/guides") return path.startsWith("/guides");

		return path === href;
	}

	const { data: conditions, isLoading: isLoadingHomePage } =
		api.condition.all.useQuery();

	const { data: personaPros } = api.persona.professionals.useQuery();

	const [currentSubMenuPersona, setCurrentSubMenuPersona] = useState<
		string | null
	>(null);

	const userNavigationItems: MainNavigationProps.Item[] = [
		{ text: "Accueil", linkProps: { href: "/" } },
		{
			text: "Je suis",
			className: classes.megaMenuCustom,
			buttonProps: {
				onClick: () => setCurrentSubMenuPersona(null),
			},
			menuLinks: personas.map((persona) => ({
				text: (
					<SubMenuCustom
						key={persona.slug}
						persona={persona}
						personaPros={personaPros || []}
						isActive={currentSubMenuPersona === persona.slug}
					/>
				),
				linkProps: {
					href: `/journeys/${persona.slug}`,
					style: {
						backgroundColor:
							currentSubMenuPersona === persona.slug
								? fr.colors.decisions.background.contrast.grey.default
								: "inherit",
					},
					onClick:
						persona.slug === "professional"
							? (e) => {
									e.preventDefault();
									setCurrentSubMenuPersona(
										currentSubMenuPersona !== persona.slug
											? persona.slug
											: null,
									);
								}
							: undefined,
				},
			})),
		},
		{ text: "Fiches pratiques", linkProps: { href: "/guides" } },
		{
			text: "Formations",
			linkProps: { href: "/formations" },
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

	const navigationItems = userNavigationItems.map((item) => ({
		...item,
		isActive: isRouteActive(item, router.asPath),
	}));

	tdhStore.set(conditions);

	return (
		<>
			<Head>
				<title>DITND</title>
			</Head>
			<div className={cx(classes.headerContainer)}>
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
							key={"button-question"}
							iconId={"fr-icon-message-2-line"}
							priority="secondary"
							size="large"
						>
							Posez votre question
						</Button>,
					]}
					serviceTitle="DI-TND"
					serviceTagline="Délégation interministérielle pour les troubles du neurodéveloppement"
				/>

				<main>
					{isLoadingHomePage ? <Loader /> : <Component {...pageProps} />}
				</main>
				<Footer
					accessibility="non compliant"
					bottomItems={[headerFooterDisplayItem]}
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
