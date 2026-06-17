import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";
import type { Cartographie, Media } from "~/payload/payload-types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import CmsPageLayout from "~/components/ui/CmsPage/CmsPageLayout";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import PageContent from "~/components/ui/PageContent";

type Props = {
	title: string;
	content: DefaultTypedEditorState;
	imageBanner: Media | null;
};

export default function CartographiePage({
	title,
	content,
	imageBanner,
}: Props) {
	if (!content) return <EmptyScreenZone>Contenu manquant</EmptyScreenZone>;

	return (
		<>
			<Head>
				<title>{title} - Maison de l'autisme</title>
				<meta
					name="description"
					content={`${title} : explorez la cartographie des ressources autisme et troubles du neurodéveloppement sur le territoire français.`}
				/>
				<meta property="og:title" content={`${title} - Maison de l'autisme`} />
				<meta
					property="og:description"
					content={`${title} : explorez la cartographie des ressources autisme et troubles du neurodéveloppement sur le territoire français.`}
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
					segments={[]}
				/>
				<PageContent>
					<CmsPageLayout
						title={title}
						content={content}
						imageBanner={imageBanner}
						showShareSocials
						fullWidthWithoutSummary
					/>
				</PageContent>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const payload = await getPayload({ config: payloadConfig });
	const cartographie = (await payload.findGlobal({
		slug: "cartographie",
		depth: 2,
	})) as Cartographie;

	const imageBanner =
		cartographie.imageBanner && typeof cartographie.imageBanner === "object"
			? cartographie.imageBanner
			: null;

	return {
		props: {
			title: cartographie.title,
			content: cartographie.content as unknown as DefaultTypedEditorState,
			imageBanner,
		},
	};
};
