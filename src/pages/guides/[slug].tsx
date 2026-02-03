import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { Loader } from "~/components/ui/Loader";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";

export default function PracticalGuidePage() {
	const router = useRouter();
	const slug = router.query.slug as string;

	const { data: guideData, isLoading: isLoadingData } =
		api.practicalGuide.getBySlug.useQuery({
			slug: slug,
		});

	if (isLoadingData) return <Loader />;

	if (!guideData) {
		return <EmptyScreenZone>Fiche introuvable</EmptyScreenZone>;
	}

	const guide = guideData;

	return (
		<>
			<Head>
				<title>DITND - {guide.title}</title>
			</Head>
			<SkipLinks
				links={[
					{
						anchor: "#summary",
						label: "Sommaire",
					},
					{
						anchor: "#pg-content",
						label: "Contenu de la fiche pratique",
					},
					{
						anchor: "#footer",
						label: "Pied de page",
					},
				]}
			/>
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
								href: "/guides",
							},
						},
					]}
				/>
				<PracticalGuidesDisplay guide={guide} />
			</div>
		</>
	);
}
