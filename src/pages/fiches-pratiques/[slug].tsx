import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { Loader } from "~/components/ui/Loader";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import PageContent from "~/components/ui/PageContent";
import { useEffect } from "react";
import { personStore, proStore } from "~/state/store";

type BreadcrumbSegment = {
	label: string;
	linkProps: { href: string };
};

function getParcoursBreadcrumbSegments(
	from: string | undefined,
): BreadcrumbSegment[] | null {
	if (!from) return null;

	const [personaSlug, conditionSlug] = from.split("/");
	if (!personaSlug || !conditionSlug) return null;

	const persona =
		personStore.get().find((p) => p.slug === personaSlug) ??
		proStore.get().find((p) => p.slug === personaSlug);

	const personaLabel = persona
		? `Je suis ${persona.displayName ?? persona.name}`
		: personaSlug;

	return [
		{
			label: personaLabel,
			linkProps: { href: `/parcours/${personaSlug}` },
		},
		{
			label: conditionSlug.toUpperCase(),
			linkProps: { href: `/parcours/${personaSlug}/${conditionSlug}` },
		},
	];
}

export default function PracticalGuidePage() {
	const router = useRouter();
	const slug = router.query.slug as string;
	const from = router.query.from as string | undefined;

	const { data: guideData, isLoading: isLoadingData } =
		api.practicalGuide.getBySlug.useQuery({
			slug: slug,
		});

	const guide = guideData;

	const { mutate: incremenView } =
		api.practicalGuide.incrementView.useMutation();

	useEffect(() => {
		if (guide?.id) {
			incremenView({ guideId: guide.id });
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

	const parcoursSegments = getParcoursBreadcrumbSegments(from);
	const breadcrumbSegments: BreadcrumbSegment[] = parcoursSegments ?? [
		{
			label: "Fiches Pratiques",
			linkProps: {
				href: "/fiches-pratiques",
			},
		},
	];

	return (
		<>
			<Head>
				<title>{guide.title} - Maison de l'autisme</title>
				<meta
					name="description"
					content={`${guide.title} : fiche pratique sur l'autisme et les troubles du neurodéveloppement - Maison de l'autisme`}
				/>
			</Head>
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel={guide.title}
					homeLinkProps={{
						href: "/",
					}}
					segments={breadcrumbSegments}
				/>
				<PageContent>
					<PracticalGuidesDisplay guide={guide} />
				</PageContent>
			</div>
		</>
	);
}
