import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import type { GetServerSideProps } from "next";
import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";
import type { About, Media } from "~/payload/payload-types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import CmsPageLayout from "~/components/ui/CmsPage/CmsPageLayout";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import PageContent from "~/components/ui/PageContent";
import SeoMeta from "~/components/ui/SeoMeta";

type Props = {
	title: string;
	content: DefaultTypedEditorState;
	imageBanner: Media | null;
	meta: {
		title: string | null;
		description: string | null;
		imageUrl: string | null;
	};
};

export default function GncraPage({
	title,
	content,
	imageBanner,
	meta,
}: Props) {
	if (!content) return <EmptyScreenZone>Contenu manquant</EmptyScreenZone>;

	return (
		<>
			<SeoMeta
				title={meta.title || title}
				description={
					meta.description ||
					`${title} : découvrez le Groupement National des Centres Ressources Autisme (GNCRA).`
				}
				image={meta.imageUrl || imageBanner?.url}
				type="article"
				pathname="/a-propos/gncra"
			/>
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel={title}
					homeLinkProps={{ href: "/" }}
					segments={[{ label: "À propos", linkProps: { href: "/a-propos" } }]}
				/>
				<PageContent>
					<CmsPageLayout
						title={title}
						content={content}
						imageBanner={imageBanner}
						showShareSocials
					/>
				</PageContent>
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
	const metaImage =
		tab.meta?.image && typeof tab.meta.image === "object"
			? tab.meta.image
			: null;

	return {
		props: {
			title: tab.title,
			content: tab.content as unknown as DefaultTypedEditorState,
			imageBanner,
			meta: {
				title: tab.meta?.title?.trim() || null,
				description: tab.meta?.description?.trim() || null,
				imageUrl: metaImage?.url ?? null,
			},
		},
	};
};
