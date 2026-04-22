import { fr } from "@codegouvfr/react-dsfr";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getPayload } from "payload";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import WysiwygContent from "~/components/ui/PracticalGuides/WysiwygContent";
import payloadConfig from "~/payload/payload.config";
import type { Footer } from "~/payload/payload-types";

type Props = {
	title: string;
	content: DefaultTypedEditorState;
};

export default function TermsOfUse({ title, content }: Props) {
	if (!content) return <EmptyScreenZone>Missing content</EmptyScreenZone>;

	return (
		<>
			<Head>
				<title>Modalités d'utilisation - Maison de l'autisme</title>
				<meta
					name="description"
					content="Modalités d'utilisation du site Maison de l'autisme, site national d'informations sur l'autisme et les troubles du neurodéveloppement."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-py-10w")}>
				<WysiwygContent title={title} content={content} />
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const payload = await getPayload({ config: payloadConfig });
	const footer = (await payload.findGlobal({ slug: "footer" })) as Footer;

	return {
		props: {
			title: footer.termsOfUse.title,
			content: footer.termsOfUse.content as unknown as DefaultTypedEditorState,
		},
	};
};
