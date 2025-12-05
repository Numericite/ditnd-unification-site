import { Header } from '@codegouvfr/react-dsfr/Header';
import { Footer } from '@codegouvfr/react-dsfr/Footer';
import { headerFooterDisplayItem } from '@codegouvfr/react-dsfr/Display';
import type { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import { createNextDsfrIntegrationApi } from '@codegouvfr/react-dsfr/next-pagesdir';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createEmotionSsrAdvancedApproach } from 'tss-react/next/pagesDir';
import { api } from '~/utils/api';
import { fr } from '@codegouvfr/react-dsfr';

declare module '@codegouvfr/react-dsfr/next-pagesdir' {
	interface RegisterLink {
		Link: typeof Link;
	}
}

const { augmentDocumentWithEmotionCache, withAppEmotionCache } =
	createEmotionSsrAdvancedApproach({ key: 'css' });

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
	defaultColorScheme: 'system',
	Link,
	preloadFonts: [
		//"Marianne-Light",
		//"Marianne-Light_Italic",
		'Marianne-Regular',
		//"Marianne-Regular_Italic",
		'Marianne-Medium',
		//"Marianne-Medium_Italic",
		'Marianne-Bold',
		//"Marianne-Bold_Italic",
		//"Spectral-Regular",
		//"Spectral-ExtraBold"
	],
});

export { augmentDocumentWithEmotionCache, dsfrDocumentApi };

const userNavigationItems: MainNavigationProps.Item[] = [
	{ text: 'Accueil', linkProps: { href: '/' } },
];

function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	const navigationItems = userNavigationItems.map(item => ({
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
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
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
						href: '/',
						title: 'Accueil DITND',
					}}
					navigation={navigationItems}
					quickAccessItems={[]}
					serviceTitle="DITND"
				/>
				<main className={fr.cx('fr-container')} style={{ flex: 1 }}>
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
