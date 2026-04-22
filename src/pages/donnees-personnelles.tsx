import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getPayload } from "payload";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import CmsPageLayout from "~/components/ui/CmsPage/CmsPageLayout";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import PageContent from "~/components/ui/PageContent";
import payloadConfig from "~/payload/payload.config";
import type { Footer } from "~/payload/payload-types";

type Props = {
	title: string;
	content: DefaultTypedEditorState;
};

export default function Cgu({ title, content }: Props) {
	if (!content) return <EmptyScreenZone>Missing content</EmptyScreenZone>;

	return (
		<>
			<Head>
				<title>Politique de confidentialité - Maison de l'autisme</title>
				<meta
					name="description"
					content="Politique de confidentialité et protection des données personnelles du site Maison de l'autisme."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-10v")}>
				<Breadcrumb
					currentPageLabel={title}
					homeLinkProps={{ href: "/" }}
					segments={[]}
				/>
				<PageContent>
					<CmsPageLayout title={title} content={content} />
				</PageContent>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const payload = await getPayload({ config: payloadConfig });
	const footer = (await payload.findGlobal({ slug: "footer" })) as Footer;

	return {
		props: {
			title: footer.cgu.title,
			content: footer.cgu.content as unknown as DefaultTypedEditorState,
		},
	};
};
