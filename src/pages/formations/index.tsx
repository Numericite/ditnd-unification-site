import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import { useState, type Dispatch, type SetStateAction } from "react";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";
import {
	SearchCoursesDisplay,
	type CoursesFiltersQuery,
} from "~/components/Courses/SearchCoursesDisplay";
import { CoursesFiltersDisplay } from "~/components/Courses/CoursesFiltersDisplay";
import type { FiltersQuery } from "~/components/PracticalGuides/GuidesFiltersDisplay";
import { tss } from "tss-react/dsfr";
import { deserialize } from "~/utils/tools";
import PageContent from "~/components/ui/PageContent";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import { DEFAULT_PAGE_SIZE, type PaginatedResult } from "~/utils/pagination";

type CoursesPaginatedResult = PaginatedResult<AugmentedCourse>;

type Props = {
	initialFilters: CoursesFiltersQuery;
	initialQuery: string;
	initialPage: number;
	initialData: CoursesPaginatedResult;
};

export default function Courses({
	initialFilters,
	initialQuery,
	initialPage,
	initialData,
}: Props) {
	const { classes, cx } = useStyles();

	const [filters, setFilters] = useState<CoursesFiltersQuery>(initialFilters);

	return (
		<>
			<Head>
				<title>
					Formations sur l'autisme et les troubles du neurodéveloppement -
					Maison de l'autisme
				</title>
				<meta
					name="description"
					content="Découvrez les formations sur l'autisme et les troubles du neurodéveloppement : sensibilisation, accompagnement, pratiques professionnelles."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-8w")}>
				<Breadcrumb
					currentPageLabel="Formations"
					homeLinkProps={{
						href: "/",
					}}
					segments={[]}
				/>
				<PageContent>
					<h1 className={fr.cx("fr-mb-4w")}>Formations</h1>

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
									<CoursesFiltersDisplay
										setFilters={
											setFilters as Dispatch<SetStateAction<FiltersQuery>>
										}
									/>
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
							<SearchCoursesDisplay
								filters={filters}
								initialFilters={initialFilters}
								initialQuery={initialQuery}
								initialPage={initialPage}
								initialData={initialData}
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
	const initialFilters: CoursesFiltersQuery = {
		conditions: deserialize(
			ctx.query.conditions as string | string[] | undefined,
		),
		themes: deserialize(ctx.query.themes as string | string[] | undefined),
		personas: deserialize(ctx.query.personas as string | string[] | undefined),
		type: deserialize(ctx.query.type as string | string[] | undefined),
	};
	const initialQuery =
		typeof ctx.query.search === "string" ? ctx.query.search : "";
	const initialPage = parsePageParam(ctx.query.page);

	const caller = createCaller(await createTRPCContext());

	const initialData = await caller.course.getByFilters({
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

const useStyles = tss.withName(Courses.name).create({
	borderRight: {
		borderRight: "2px solid var(--border-default-grey)",
	},
});
