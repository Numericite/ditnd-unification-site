import { fr } from "@codegouvfr/react-dsfr";
import Summary from "@codegouvfr/react-dsfr/Summary";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { useState } from "react";
import { slugify } from "~/utils/tools";
import type { AugmentedJourney } from "~/server/api/routers/journeys";
import { useRouter } from "next/router";
import PersonaContent from "../ui/PersonaPage/PersonaContent";

export default function PersonaDisplay({
	journey,
}: {
	journey: AugmentedJourney;
}) {
	const [query, setQuery] = useState<string>("");

	const router = useRouter();
	const routerCondition = router.query.condition as string;

	const chapterLinks = journey.chapter.map((chap) => ({
		linkProps: {
			href: `#${slugify(chap["chapter-name"])}`,
		},
		text: chap["chapter-name"],
	}));

	const chaptersList = journey.chapter;

	return (
		<div className={fr.cx("fr-grid-row")}>
			<div
				className={fr.cx(
					"fr-pr-3v",
					"fr-col-12",
					"fr-col-lg-4",
					"fr-col-md-12",
					"fr-col-sm-12",
					"fr-mb-2w",
				)}
			>
				<Summary links={chapterLinks} title="Thématiques" />
			</div>
			<div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
				<SearchBarUI
					onClick={(query) => {
						setQuery(query);
					}}
				/>
				{chaptersList.map((chap, index) => (
					<div key={index} className={fr.cx("fr-pt-3w")}>
						<h3 id={slugify(chap["chapter-name"])}>{chap["chapter-name"]}</h3>

						<div
							key={chap.id}
							className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}
						>
							<PersonaContent
								value={chap["practical-guides"]}
								condition={routerCondition}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
