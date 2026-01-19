import { fr } from "@codegouvfr/react-dsfr";
import { PracticalGuide } from "../ui/PracticalGuides/PracticalGuide";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

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
						{guides.map((guide, index) => (
							<div
								key={`guide${index}`}
								className={fr.cx("fr-col-12", "fr-col-sm-6")}
								style={{ display: "flex" }}
							>
								<PracticalGuide guide={guide} />
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
