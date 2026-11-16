import {
	Html,
	Head,
	Main,
	NextScript,
	type DocumentProps,
} from "next/document";
import { augmentDocumentWithEmotionCache, dsfrDocumentApi } from "./_app";

const { getColorSchemeHtmlAttributes, augmentDocumentForDsfr } =
	dsfrDocumentApi;

export default function Document(props: DocumentProps) {
	return (
		<Html lang="fr" {...getColorSchemeHtmlAttributes(props)}>
			<Head>
				{/* Validation Google Search Console du domaine maisondelautisme.gouv.fr (propriété du client) */}
				<meta
					name="google-site-verification"
					content="z0blW2WIj3fZUk-59DjPEGfhYZx3uo-8gILKqLo3tGg"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

augmentDocumentForDsfr(Document);
augmentDocumentWithEmotionCache(Document);
