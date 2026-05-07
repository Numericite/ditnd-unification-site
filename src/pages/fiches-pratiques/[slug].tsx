import { api } from "~/utils/api";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import PageContent from "~/components/ui/PageContent";
import SeoMeta from "~/components/ui/SeoMeta";
import { useEffect } from "react";
import { personStore, proStore } from "~/state/store";
import type { Media } from "~/payload/payload-types";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

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

type Props = {
	guide: AugmentedPracticalGuide;
	from: string | null;
};

export default function PracticalGuidePage({ guide, from }: Props) {
	const { mutate: incremenView } =
		api.practicalGuide.incrementView.useMutation();

	useEffect(() => {
		if (guide?.id) {
			incremenView({ guideId: guide.id });
		}
	}, [guide?.id]);

	const parcoursSegments = getParcoursBreadcrumbSegments(from ?? undefined);
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

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const slug = ctx.params?.slug as string | undefined;
	const fromParam = ctx.query.from;
	const from = typeof fromParam === "string" ? fromParam : null;

	if (!slug) {
		return { notFound: true };
	}

	const caller = createCaller(await createTRPCContext());

	try {
		const guide = await caller.practicalGuide.getBySlug({ slug });

		if (!guide) {
			return { notFound: true };
		}

		return {
			props: {
				guide,
				from,
			},
		};
	} catch {
		return { notFound: true };
	}
};
