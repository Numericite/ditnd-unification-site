import { fr } from "@codegouvfr/react-dsfr";
import { PracticalGuide } from "../ui/PracticalGuides/PracticalGuide";
import type { PracticalGuide as PracticalGuideType } from "~/payload/payload-types";

export default function RecommendedGuides({
	guides,
}: {
	guides: (number | PracticalGuideType)[];
}) {
	if (typeof guides === "number") return;
	return (
		<div>
			{guides.length !== 0 && (
				<div className={fr.cx("fr-mt-2w")}>
					<h5 id="fiches-pratiques">
						Ces fiches pratiques qui pourraient vous intéresser{" "}
					</h5>
					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						{guides.map((g, index) => {
							if (typeof g === "number") {
								return undefined;
							}
							const condition0 = g.conditions?.[0];
							const theme0 = g.theme?.[0];

							const populatedCondition =
								typeof condition0 === "number" ? undefined : condition0;

							const populatedTheme =
								typeof theme0 === "number" ? undefined : theme0;

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
										badge={populatedTheme?.name}
										description={g.description}
										condition={populatedCondition?.slug}
										textColor={populatedCondition?.textColor}
										backgroundColor={populatedCondition?.backgroundColor}
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
