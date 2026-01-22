import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import PracticalGuidesGroup from "../ui/PracticalGuides/PracticalGuidesGroup";

export default function RecommendedGuides({
	guides,
}: {
	guides: AugmentedPracticalGuide[];
}) {
	return (
		<div>
			{guides.length !== 0 && (
				<div className={fr.cx("fr-mt-2w")}>
					<h3 id="fiches-pratiques">
						Ces fiches pratiques qui pourraient vous intéresser
					</h3>
					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						<PracticalGuidesGroup
							className={fr.cx("fr-col-lg-6")}
							practicalGuides={guides}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
