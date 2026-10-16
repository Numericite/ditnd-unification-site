import Head from "next/head";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import SeoMeta from "~/components/ui/SeoMeta";
import type { Media } from "~/payload/payload-types";
import { fr } from "@codegouvfr/react-dsfr";
import PageContent from "~/components/ui/PageContent";
import CmsPageLayout from "~/components/ui/CmsPage/CmsPageLayout";
import ErrorPage from "~/components/ui/ErrorPage/ErrorPage";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { AugmentedPage } from "~/server/api/routers/pages";

type Props = { isNotFound: true } | { isNotFound?: false; page: AugmentedPage };

export default function PageView(props: Props) {
	if (props.isNotFound || !props.page) {
		return (
			<>
				<Head>
					<title>Page non trouvée - Maison de l'autisme</title>
					<meta name="robots" content="noindex" />
				</Head>
				<ErrorPage />
			</>
		);
	}

	const { page } = props;

	const metaTitle = page.meta?.title?.trim() || page.title;
	const metaDescription = page.meta?.description?.trim() || "";
	const metaImage =
		(page.meta?.image as Media | null)?.url ||
		page.imageBanner?.url ||
		undefined;

	return (
		<>
			<SeoMeta
				title={metaTitle}
				description={metaDescription}
				image={metaImage}
				type="article"
				pathname={`/${page.slug}`}
			/>
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel={page.title}
					homeLinkProps={{ href: "/" }}
					segments={[]}
				/>
				<PageContent>
					<CmsPageLayout
						title={page.title}
						content={page.content}
						imageBanner={page.imageBanner}
						createdAt={page.publishedAt ?? page.createdAt}
						lastUpdatedAt={page.lastUpdatedAt}
						showShareSocials
					/>
				</PageContent>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const slug = ctx.params?.slug as string | undefined;

	if (!slug) {
		ctx.res.statusCode = 404;
		return { props: { isNotFound: true } };
	}

	const caller = createCaller(await createTRPCContext());

	try {
		const page = await caller.page.getBySlug({ slug });
		return { props: { page } };
	} catch {
		ctx.res.statusCode = 404;
		return { props: { isNotFound: true } };
	}
};
