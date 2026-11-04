import Head from "next/head";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(
	/\/$/,
	"",
);
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "GovernmentOrganization",
	"@id": ORGANIZATION_ID,
	name: "Maison de l'autisme",
	url: `${SITE_URL}/`,
	logo: `${SITE_URL}/main-logo.png`,
	description:
		"Site national d'informations sur l'autisme et les troubles du neurodéveloppement.",
	areaServed: { "@type": "Country", name: "France" },
	contactPoint: [
		{
			"@type": "ContactPoint",
			contactType: "Particuliers",
			url: `${SITE_URL}/contact-particuliers`,
			availableLanguage: "fr",
		},
		{
			"@type": "ContactPoint",
			contactType: "Professionnels et CRA",
			url: `${SITE_URL}/contact-pros-cra`,
			availableLanguage: "fr",
		},
	],
};

type JsonLdProps = {
	id: string;
	data: Record<string, unknown>;
};

export default function JsonLd({ id, data }: JsonLdProps) {
	return (
		<Head>
			<script
				key={`jsonld-${id}`}
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(data).replace(/</g, "\\u003c"),
				}}
			/>
		</Head>
	);
}
