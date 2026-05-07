import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import {
	GuidesFiltersDisplay,
	type FiltersQuery,
} from "~/components/PracticalGuides/GuidesFiltersDisplay";
import { SearchGuidesDisplay } from "~/components/PracticalGuides/SearchGuidesDisplay";
import { useState } from "react";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";
import { tss } from "tss-react/dsfr";
import { deserialize } from "~/utils/tools";
import PageContent from "~/components/ui/PageContent";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import { DEFAULT_PAGE_SIZE, type PaginatedResult } from "~/utils/pagination";

type GuidesPaginatedResult = PaginatedResult<AugmentedPracticalGuide>;

type Props = {
	initialFilters: FiltersQuery;
	initialQuery: string;
	initialPage: number;
	initialData: GuidesPaginatedResult;
};

export default function PracticalGuides({
	initialFilters,
	initialQuery,
	initialPage,
	initialData,
}: Props) {
	const { classes, cx } = useStyles();

	const [filters, setFilters] = useState<FiltersQuery>(initialFilters);

	return (
		<>
			<Head>
				<title>
					Fiches pratiques sur l'autisme et les troubles du neurodéveloppement -
					Maison de l'autisme
				</title>
				<meta
					name="description"
					content="Retrouvez toutes les fiches pratiques sur l'autisme et ses troubles associés : diagnostic, accompagnement, scolarité, emploi, vie quotidienne."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-8w")}>
				<Breadcrumb
					currentPageLabel="Fiches Pratiques"
					homeLinkProps={{
						href: "/",
					}}
					segments={[]}
				/>

				<PageContent>
					<h1 className={fr.cx("fr-mb-4w")}>Fiches pratiques</h1>

					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						<aside
							className={cx(
								fr.cx("fr-col-12", "fr-col-md-4"),
								classes.borderRight,
							)}
						>
							<div className={fr.cx("fr-p-3w")}>
								<h2 className={fr.cx("fr-h4")}>Affiner la recherche</h2>
								<SkipLinks
									links={[
										{
											label: "Aller aux résultats de recherche",
											anchor: "#results",
										},
									]}
								/>
								<div className={fr.cx("fr-mt-2w")}>
									<GuidesFiltersDisplay setFilters={setFilters} />
								</div>
							</div>
						</aside>

						<div
							className={fr.cx(
								"fr-col-12",
								"fr-col-md-8",
								"fr-px-0",
								"fr-px-md-4w",
							)}
						>
							<SearchGuidesDisplay
								filters={filters}
								initialQuery={initialQuery}
								initialPage={initialPage}
								initialData={initialData}
								initialFilters={initialFilters}
							/>
						</div>
					</div>
				</PageContent>
			</div>
		</>
	);
}

function parsePageParam(value: string | string[] | undefined): number {
	const raw = Array.isArray(value) ? value[0] : value;
	const parsed = raw ? parseInt(raw, 10) : 1;
	return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const initialFilters: FiltersQuery = {
		conditions: deserialize(
			ctx.query.conditions as string | string[] | undefined,
		),
		themes: deserialize(ctx.query.themes as string | string[] | undefined),
		personas: deserialize(ctx.query.personas as string | string[] | undefined),
	};
	const initialQuery =
		typeof ctx.query.search === "string" ? ctx.query.search : "";
	const initialPage = parsePageParam(ctx.query.page);

	const caller = createCaller(await createTRPCContext());

	const initialData = await caller.practicalGuide.getByFilters({
		...initialFilters,
		text: initialQuery,
		page: initialPage,
		limit: DEFAULT_PAGE_SIZE,
	});

	return {
		props: {
			initialFilters,
			initialQuery,
			initialPage,
			initialData,
		},
	};
};

const useStyles = tss.withName(PracticalGuides.name).create({
	borderRight: {
		borderRight: "2px solid var(--border-default-grey)",
	},
});
