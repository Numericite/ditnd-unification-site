import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import PracticalGuidesDisplay from "~/components/PracticalGuides/PracticalGuidesDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import PageContent from "~/components/ui/PageContent";
import type { GetServerSideProps } from "next";
import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";
import { resolveRelations } from "~/server/api/trpc";
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

	const payload = await getPayload({ config: payloadConfig });

	// Verify the requester is an authenticated Payload admin.
	// Payload's Local API bypasses collection access rules, so we must
	// gate draft access ourselves before issuing the find().
	const headers = new Headers();
	for (const [key, value] of Object.entries(ctx.req.headers)) {
		if (typeof value === "string") headers.set(key, value);
		else if (Array.isArray(value)) headers.set(key, value.join(", "));
	}

	const { user } = await payload.auth({ headers });

	if (!user || (user as { role?: string }).role !== "admin") {
		// Return 404 (not a redirect) so we don't leak the existence of
		// unpublished slugs to anonymous visitors.
		return { notFound: true };
	}

	try {
		const result = await payload.find({
			collection: "practical-guides",
			limit: 1,
			depth: 2,
			draft: true,
			where: { slug: { equals: slug } },
		});

		const guide = result.docs[0];
		if (!guide || !guide["practical-guides"] || !guide.courses) {
			return { notFound: true };
		}

		const augmented = {
			...guide,
			themes: await resolveRelations(guide.themes, "themes"),
			courses: await resolveRelations(guide.courses, "courses"),
			"practical-guides": await resolveRelations(
				guide["practical-guides"],
				"practical-guides",
			),
		} as AugmentedPracticalGuide;

		return { props: { guide: augmented } };
	} catch {
		return { notFound: true };
	}
};
