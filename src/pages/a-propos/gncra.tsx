import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";
import type { About, Media } from "~/payload/payload-types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import CmsPageLayout from "~/components/ui/CmsPage/CmsPageLayout";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";

type Props = {
	title: string;
	content: DefaultTypedEditorState;
	imageBanner: Media | null;
};

export default function GncraPage({ title, content, imageBanner }: Props) {
	if (!content) return <EmptyScreenZone>Missing content</EmptyScreenZone>;

	return (
		<>
			<Head>
				<title>{title} - Maison de l'autisme</title>
				<meta
					name="description"
					content={`${title} : découvrez le Groupement National des Centres Ressources Autisme (GNCRA).`}
				/>
				<meta property="og:title" content={`${title} - Maison de l'autisme`} />
				<meta
					property="og:description"
					content={`${title} : découvrez le Groupement National des Centres Ressources Autisme (GNCRA).`}
				/>
				<meta property="og:type" content="article" />
				{imageBanner?.url && (
					<meta property="og:image" content={imageBanner.url} />
				)}
			</Head>
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel={title}
					homeLinkProps={{ href: "/" }}
					segments={[{ label: "À propos", linkProps: { href: "#" } }]}
				/>
				<CmsPageLayout
					title={title}
					content={content}
					imageBanner={imageBanner}
					showShareSocials
				/>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const payload = await getPayload({ config: payloadConfig });
	const about = (await payload.findGlobal({
		slug: "about",
		depth: 2,
	})) as About;

	const tab = about.gncra;
	const imageBanner =
		tab.imageBanner && typeof tab.imageBanner === "object"
			? tab.imageBanner
			: null;

	return {
		props: {
			title: tab.title,
			content: tab.content as unknown as DefaultTypedEditorState,
			imageBanner,
		},
	};
};
