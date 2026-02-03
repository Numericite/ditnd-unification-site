import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import CardsDisplayGroup from "../ui/Cards/CardsDisplayGroup";

export default function MostViewedGuides({
	guides,
}: {
	guides: AugmentedPracticalGuide[];
}) {
	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			<CardsDisplayGroup
				className={fr.cx("fr-col-lg-4")}
				guides={guides}
				titleAs="h3"
				kind="guides"
			/>
		</div>
	);
}
