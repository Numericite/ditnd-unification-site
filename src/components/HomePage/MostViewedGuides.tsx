import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import PracticalGuidesGroup from "../ui/PracticalGuides/PracticalGuidesGroup";

export default function MostViewedGuides({
	guides,
}: {
	guides: AugmentedPracticalGuide[];
}) {
	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			<PracticalGuidesGroup practicalGuides={guides} lg={4} />
		</div>
	);
}
