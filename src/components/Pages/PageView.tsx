import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import CmsPageLayout from "~/components/ui/CmsPage/CmsPageLayout";
import PageContent from "~/components/ui/PageContent";
import SeoMeta from "~/components/ui/SeoMeta";
import type { Media } from "~/payload/payload-types";
import type { AugmentedPage } from "~/server/api/routers/pages";
import { pagePath, pageSection } from "~/utils/pages";

type Props = {
	page: AugmentedPage;
	draft?: boolean;
};

export default function PageView({ page, draft = false }: Props) {
	const section = pageSection(page.section);
	const dates = page.showDates
		? {
				createdAt: page.publishedAt ?? page.createdAt,
				lastUpdatedAt: page.lastUpdatedAt,
			}
		: {};

	return (
		<>
			{draft ? (
				<Head>
					<title>{page.title} (brouillon) - Maison de l'autisme</title>
					<meta name="robots" content="noindex" />
				</Head>
			) : (
				<SeoMeta
					title={page.meta?.title?.trim() || page.title}
					description={page.meta?.description?.trim() || ""}
					image={
						(page.meta?.image as Media | null)?.url ||
						page.imageBanner?.url ||
						undefined
					}
					type="article"
					pathname={pagePath(page)}
				/>
			)}
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel={page.title}
					homeLinkProps={{ href: "/" }}
					segments={
						section
							? [
									{
										label: section.label,
										linkProps: { href: `/${section.value}` },
									},
								]
							: []
					}
				/>
				<PageContent>
					<CmsPageLayout
						title={page.title}
						content={page.content}
						imageBanner={page.imageBanner}
						{...dates}
						showShareSocials={!draft}
					/>
				</PageContent>
			</div>
		</>
	);
}
