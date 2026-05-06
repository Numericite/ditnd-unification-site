import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import { Loader } from "~/components/ui/Loader";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import PageContent from "~/components/ui/PageContent";
import SeoMeta from "~/components/ui/SeoMeta";
import { useEffect } from "react";
import { personStore, proStore } from "~/state/store";
import type { Media } from "~/payload/payload-types";

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

	const metaImageRef = guide.meta?.image;
	const metaImageObj =
		metaImageRef && typeof metaImageRef === "object"
			? (metaImageRef as Media)
			: undefined;

	const metaTitle = guide.meta?.title?.trim() || guide.title;
	const metaDescription =
		guide.meta?.description?.trim() ||
		guide.description?.trim() ||
		`${guide.title} : fiche pratique sur l'autisme et les troubles du neurodéveloppement.`;
	const metaImage =
		metaImageObj?.url ||
		guide.imageBanner?.url ||
		guide.image?.url ||
		undefined;

	return (
		<>
			<SeoMeta
				title={metaTitle}
				description={metaDescription}
				image={metaImage}
				type="article"
				pathname={`/fiches-pratiques/${guide.slug}`}
			/>
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
