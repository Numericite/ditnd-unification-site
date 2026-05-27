import { api } from "~/utils/api";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import ContentModeToggle, {
	CONTENT_MODE_COOKIE,
	type ContentMode,
} from "~/components/PracticalGuides/ContentModeToggle";
import { fr } from "@codegouvfr/react-dsfr";
import PageContent from "~/components/ui/PageContent";
import SeoMeta from "~/components/ui/SeoMeta";
import { useEffect, useMemo, useState } from "react";
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
	initialMode: ContentMode;
};

export default function PracticalGuidePage({
	guide,
	from,
	initialMode,
}: Props) {
	const { mutate: incremenView } =
		api.practicalGuide.incrementView.useMutation();

	useEffect(() => {
		if (guide?.id) {
			incremenView({ guideId: guide.id });
		}
	}, [guide?.id]);

	const [mode, setMode] = useState<ContentMode>(initialMode);

	const isSimplifiedReady =
		guide.simplifiedGenerationStatus === "ready" && !!guide.contentSimplified;

	const displayedGuide = useMemo(() => {
		if (mode === "simplified" && isSimplifiedReady && guide.contentSimplified) {
			return { ...guide, content: guide.contentSimplified };
		}
		return guide;
	}, [guide, mode, isSimplifiedReady]);

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
					<PracticalGuidesDisplay
						guide={displayedGuide}
						headerToolbar={
							isSimplifiedReady ? (
								<ContentModeToggle mode={mode} onChange={setMode} />
							) : undefined
						}
					/>
				</PageContent>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const slug = ctx.params?.slug as string | undefined;
	const fromParam = ctx.query.from;
	const from = typeof fromParam === "string" ? fromParam : null;
	const cookieMode = ctx.req.cookies?.[CONTENT_MODE_COOKIE];
	const initialMode: ContentMode =
		cookieMode === "simplified" ? "simplified" : "standard";

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
				initialMode,
			},
		};
	} catch {
		return { notFound: true };
	}
};
