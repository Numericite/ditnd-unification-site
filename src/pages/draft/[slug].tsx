import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { Loader } from "~/components/ui/Loader";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import PageContent from "~/components/ui/PageContent";

export default function PracticalGuidePage() {
	const router = useRouter();
	const slug = router.query.slug as string;

	const { data: guideData, isLoading: isLoadingData } =
		api.practicalGuide.getBySlug.useQuery({
			slug: slug,
			draft: true,
		});

	const guide = guideData;

	if (isLoadingData)
		return (
			<EmptyScreenZone>
				<Loader />
			</EmptyScreenZone>
		);

	if (!guide) {
		return <EmptyScreenZone>Fiche introuvable</EmptyScreenZone>;
	}

	return (
		<>
			<Head>
				<title>{guide.title} (brouillon) - Maison de l'autisme</title>
				<meta
					name="description"
					content={`${guide.title} : brouillon de fiche pratique - Maison de l'autisme`}
				/>
			</Head>
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel={guide.title}
					homeLinkProps={{
						href: "/",
					}}
					segments={[
						{
							label: "Fiches Pratiques",
							linkProps: {
								href: "/fiches-pratiques",
							},
						},
					]}
				/>
				<PageContent>
					<PracticalGuidesDisplay guide={guide} />
				</PageContent>
			</div>
		</>
	);
}
