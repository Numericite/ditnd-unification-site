import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import {
	FiltersDisplay,
	type FiltersQuery,
} from "~/components/PracticalGuides/FiltersDisplay";
import { PracticalGuidesDisplay } from "~/components/PracticalGuides/SearchGuidesDisplay";
import { useState } from "react";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";

export default function PracticalGuides() {
	const [filters, setFilters] = useState<FiltersQuery>({
		conditions: [],
		themes: [],
		personas: [],
	});

	return (
		<>
			<Breadcrumb
				currentPageLabel="Fiches Pratiques"
				homeLinkProps={{
					href: "/",
				}}
				segments={[]}
			/>
			<Head>
				<title>DITND - Fiches Pratiques</title>
			</Head>

			<div>
				<h1 className={fr.cx("fr-mb-4w")}>Fiches pratiques</h1>

				<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
					<aside
						className={fr.cx("fr-col-12", "fr-col-md-4")}
						style={{
							borderRight: "2px solid var(--border-default-grey)",
						}}
					>
						<div className={fr.cx("fr-p-3w")}>
							<p className={fr.cx("fr-h4")}>Affiner la recherche</p>
							<div className={fr.cx("fr-mt-2w")}>
								<FiltersDisplay setFilters={setFilters} />
							</div>
						</div>
					</aside>

					<main className={fr.cx("fr-col-12", "fr-col-md-8")}>
						<PracticalGuidesDisplay filters={filters} />
					</main>
				</div>
			</div>
		</>
	);
}
