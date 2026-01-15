import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import { PracticalGuide } from "../ui/PracticalGuides/PracticalGuide";

export default function MostViewedGuides({
	guides,
}: {
	guides: AugmentedPracticalGuide[];
}) {
	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			{guides?.map((guide) => (
				<div
					key={guide.id}
					className={fr.cx("fr-col-12", "fr-col-md-6", "fr-col-lg-4")}
					style={{ display: "flex" }}
				>
					<PracticalGuide guide={guide} />
				</div>
			))}
		</div>
	);
}
