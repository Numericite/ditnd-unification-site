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
						{guides.map((g, index) => {
							const condition0 = g.conditions?.[0];
							const theme0 = g.theme?.[0];
							return (
								<div
									key={`guide${index}`}
									className={fr.cx("fr-col-12", "fr-col-sm-6")}
									style={{ display: "flex" }}
								>
									<PracticalGuide
										key={g.slug}
										title={g.title}
										slug={g.slug}
										badge={theme0?.name}
										description={g.description}
										condition={condition0?.slug}
										textColor={condition0?.textColor}
										backgroundColor={condition0?.backgroundColor}
									/>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
