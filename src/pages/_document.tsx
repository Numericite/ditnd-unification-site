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
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

augmentDocumentForDsfr(Document);
augmentDocumentWithEmotionCache(Document);
