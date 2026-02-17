import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import {
	GuidesFiltersDisplay,
	type FiltersQuery,
} from "~/components/PracticalGuides/GuidesFiltersDisplay";
import { SearchGuidesDisplay } from "~/components/PracticalGuides/SearchGuidesDisplay";
import { useState } from "react";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import { tss } from "tss-react";
import { useRouter } from "next/router";
import { deserialize } from "~/utils/tools";

export default function PracticalGuides() {
	const { classes, cx } = useStyles();

	const router = useRouter();
	const { conditions, themes, personas } = router.query;

	const [filters, setFilters] = useState<FiltersQuery>({
		conditions: deserialize(conditions) ?? [],
		themes: deserialize(themes) ?? [],
		personas: deserialize(personas) ?? [],
	});

	return (
		<>
			<Head>
				<title>DITND - Fiches Pratiques</title>
				<meta
					name="description"
					content={`Page sur la recherche de fiches pratiques liés au troubles du neurodéveloppement`}
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

				<div>
					<h1 className={fr.cx("fr-mb-4w")}>Fiches pratiques</h1>

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
							<SearchGuidesDisplay filters={filters} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

const useStyles = tss.withName(PracticalGuides.name).create({
	borderRight: {
		borderRight: "2px solid var(--border-default-grey)",
	},
});
