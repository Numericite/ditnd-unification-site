import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { Loader } from "~/components/ui/Loader";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";

export default function PracticalGuidePage() {
	const router = useRouter();
	const slug = router.query.slug as string;

	const { data: guideData } = api.practicalGuide.getBySlug.useQuery({
		slug: slug,
	});

	if (!guideData || guideData.length === 0) {
		return <div>Fiche introuvable</div>;
	}

	const guide = guideData[0];

	return (
		<>
			{!guide ? (
				<Loader />
			) : (
				<div>
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
			)}
		</>
	);
}
