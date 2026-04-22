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
import { useRouter } from "next/router";
import { deserialize } from "~/utils/tools";
import PageContent from "~/components/ui/PageContent";

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
							<SearchGuidesDisplay filters={filters} />
						</div>
					</div>
				</PageContent>
			</div>
		</>
	);
}

const useStyles = tss.withName(PracticalGuides.name).create({
	borderRight: {
		borderRight: "2px solid var(--border-default-grey)",
	},
});
