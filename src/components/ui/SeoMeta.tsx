import Head from "next/head";

const SITE_NAME = "Maison de l'autisme";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const DEFAULT_DESCRIPTION =
	"Site national d'informations sur l'autisme et les troubles du neurodéveloppement.";
const DEFAULT_IMAGE = "/HomePageIllustration.svg";

type SeoMetaProps = {
	title?: string;
	description?: string;
	image?: string | null;
	type?: "website" | "article";
	pathname?: string;
};

export default function SeoMeta({
	title,
	description,
	image,
	type = "website",
	pathname,
}: SeoMetaProps) {
	const baseTitle = title?.trim() || SITE_NAME;
	const fullTitle = baseTitle.includes(SITE_NAME)
		? baseTitle
		: `${baseTitle} - ${SITE_NAME}`;
	const finalDescription = description?.trim() || DEFAULT_DESCRIPTION;

	const rawImage = image?.trim() || DEFAULT_IMAGE;
	const finalImage = rawImage.startsWith("http")
		? rawImage
		: `${SITE_URL}${rawImage}`;

	const url = pathname ? `${SITE_URL}${pathname}` : undefined;

	return (
		<Head>
			<title>{fullTitle}</title>
			<meta key="description" name="description" content={finalDescription} />
			<meta key="og:title" property="og:title" content={fullTitle} />
			<meta
				key="og:description"
				property="og:description"
				content={finalDescription}
			/>
			<meta key="og:type" property="og:type" content={type} />
			<meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
			<meta key="og:locale" property="og:locale" content="fr_FR" />
			<meta key="og:image" property="og:image" content={finalImage} />
			{url && <meta key="og:url" property="og:url" content={url} />}
			<meta
				key="twitter:card"
				name="twitter:card"
				content="summary_large_image"
			/>
			<meta key="twitter:title" name="twitter:title" content={fullTitle} />
			<meta
				key="twitter:description"
				name="twitter:description"
				content={finalDescription}
			/>
			<meta key="twitter:image" name="twitter:image" content={finalImage} />
		</Head>
	);
}
