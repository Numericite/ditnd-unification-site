import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import { useState, type Dispatch, type SetStateAction } from "react";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import {
	SearchCoursesDisplay,
	type CoursesFiltersQuery,
} from "~/components/Courses/SearchCoursesDisplay";
import { CoursesFiltersDisplay } from "~/components/Courses/CoursesFiltersDisplay";
import type { FiltersQuery } from "~/components/PracticalGuides/GuidesFiltersDisplay";
import { tss } from "tss-react";
import { useRouter } from "next/router";
import { deserialize } from "~/utils/tools";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";

export default function Courses() {
	const { classes, cx } = useStyles();

	const router = useRouter();
	const { conditions, themes, personas, type } = router.query;

	const [filters, setFilters] = useState<CoursesFiltersQuery>({
		conditions: deserialize(conditions) ?? [],
		themes: deserialize(themes) ?? [],
		personas: deserialize(personas) ?? [],
		type: deserialize(type) ?? [],
	});

	return (
		<>
			<Head>
				<title>DITND - Formations</title>
			</Head>
			<meta
				name="description"
				content={`Page sur la recherche de formations liés au troubles du neurodéveloppement`}
			/>
			<SkipLinks
				links={[
					{
						anchor: "#contenu",
						label: "Contenu",
					},
					{
						anchor: "#filters",
						label: "Filtres de recherche",
					},
					{
						anchor: "#search-global",
						label: "Recherche",
					},
					{
						anchor: "#footer",
						label: "Pied de page",
					},
				]}
			/>
			<div className={fr.cx("fr-container", "fr-pb-8w")}>
				<Breadcrumb
					currentPageLabel="Formations"
					homeLinkProps={{
						href: "/",
					}}
					segments={[]}
				/>
				<div>
					<h1 className={fr.cx("fr-mb-4w")}>Formations</h1>

					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						<aside
							className={cx(
								fr.cx("fr-col-12", "fr-col-md-4"),
								classes.borderRight,
							)}
						>
							<div className={fr.cx("fr-p-3w")}>
								<h2 className={fr.cx("fr-h4")} id="filters">
									Affiner la recherche
								</h2>
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
							<SearchCoursesDisplay filters={filters} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

const useStyles = tss.withName(Courses.name).create({
	borderRight: {
		borderRight: "2px solid var(--border-default-grey)",
	},
});
