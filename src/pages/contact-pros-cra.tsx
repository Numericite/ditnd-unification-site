import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getPayload } from "payload";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { tss } from "tss-react/dsfr";
import CmsPageLayout from "~/components/ui/CmsPage/CmsPageLayout";
import ContactProsCraForm from "~/components/ui/ContactProsCraForm/ContactProsCraForm";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import PageContent from "~/components/ui/PageContent";
import payloadConfig from "~/payload/payload.config";
import type { Footer, Media } from "~/payload/payload-types";

type Props = {
	title: string;
	content: DefaultTypedEditorState;
	imageBanner: Media | null;
};

export default function ContactProsCraPage({
	title,
	content,
	imageBanner,
}: Props) {
	const { classes, cx } = useStyles();

	if (!content) return <EmptyScreenZone>Missing content</EmptyScreenZone>;

	return (
		<>
			<Head>
				<title>{title} - Maison de l&apos;autisme</title>
				<meta
					name="description"
					content="Formulaire de contact dédié aux professionnels des Centres Ressources Autisme (CRA)."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-10v")}>
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
					>
						<div className={cx(classes.formWrapper)}>
							<ContactProsCraForm />
						</div>
					</CmsPageLayout>
				</PageContent>
			</div>
		</>
	);
}

const useStyles = tss.withName(ContactProsCraPage.name).create(() => ({
	formWrapper: {
		marginTop: fr.spacing("6w"),
	},
}));

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const payload = await getPayload({ config: payloadConfig });
	const footer = (await payload.findGlobal({
		slug: "footer",
		depth: 2,
	})) as Footer;

	const tab = footer.contactProsCra;
	const imageBanner =
		tab?.imageBanner && typeof tab.imageBanner === "object"
			? tab.imageBanner
			: null;

	return {
		props: {
			title:
				tab?.title ??
				"Formulaire de contact réservé aux professionnels des CRA",
			content: (tab?.content ?? null) as unknown as DefaultTypedEditorState,
			imageBanner,
		},
	};
};
