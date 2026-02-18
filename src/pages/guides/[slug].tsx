import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { Loader } from "~/components/ui/Loader";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { useEffect } from "react";

export default function PracticalGuidePage() {
	const router = useRouter();
	const slug = router.query.slug as string;

	const { data: guideData, isLoading: isLoadingData } =
		api.practicalGuide.getBySlug.useQuery({
			slug: slug,
		});

	const guide = guideData;

	const { mutate } = api.practicalGuide.incrementView.useMutation();

	useEffect(() => {
		if (guide?.id) {
			mutate({ guideId: guide.id });
		}
	}, [guide?.id]);

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
				<title>DITND - {guide.title}</title>
				<meta
					name="description"
					content={`Fiche pratique sur ${guide.title} `}
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
