import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { Loader } from "~/components/ui/Loader";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import { fr } from "@codegouvfr/react-dsfr";

export default function PracticalGuidePage() {
	const router = useRouter();
	const slug = router.query.slug as string;

	const { data: guideData, isLoading: isLoadingData } =
		api.practicalGuide.getBySlug.useQuery({
			slug: slug,
		});

	if (isLoadingData) return <Loader />;

	if (!guideData) {
		return <div>Fiche introuvable</div>;
	}

	const guide = guideData;

	return (
		<div className={fr.cx("fr-container")}>
			<Head>
				<title>DITND - {guide.title}</title>
			</Head>
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
	);
}
