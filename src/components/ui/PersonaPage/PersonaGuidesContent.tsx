import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import { PracticalGuide } from "../PracticalGuides/PracticalGuide";
import { fr } from "@codegouvfr/react-dsfr";

export default function PersonaGuidesContent({
	value,
	condition,
}: {
	value: AugmentedPracticalGuide[];
	condition: string;
}) {
	return value
		.filter(
			(g) =>
				g.conditions.some((c) => c.slug === condition) ||
				g.conditions.length === 0,
		)
		.map((guide, index) => {
			return (
				<div
					key={index}
					className={fr.cx("fr-col-12", "fr-col-md-6")}
					style={{ display: "flex" }}
				>
					<PracticalGuide guide={guide} />
				</div>
			);
		});
}
