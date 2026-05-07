import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import PageContent from "~/components/ui/PageContent";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

type Props = {
	guide: AugmentedPracticalGuide;
};

export default function PracticalGuideDraftPage({ guide }: Props) {
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

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const slug = ctx.params?.slug;

	if (typeof slug !== "string") {
		return { notFound: true };
	}

	const caller = createCaller(await createTRPCContext());

	try {
		const guide = await caller.practicalGuide.getBySlug({ slug, draft: true });

		if (!guide) {
			return { notFound: true };
		}

		return { props: { guide } };
	} catch {
		return { notFound: true };
	}
};
