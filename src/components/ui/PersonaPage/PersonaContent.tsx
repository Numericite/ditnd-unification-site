import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import { PracticalGuide } from "../PracticalGuides/PracticalGuide";
import { fr } from "@codegouvfr/react-dsfr";

export default function PersonaContent({
	value,
	condition,
}: {
	value: AugmentedPracticalGuide[];
	condition: string;
}) {
	return value
		.filter(
			(g) =>
				g.conditions[0]?.slug === condition || g.conditions[0]?.slug === "all",
		)
		.map((guide, index) => {
			const theme = guide.theme[0];
			const condition = guide.conditions[0];

			return (
				<div
					key={index}
					className={fr.cx("fr-col-12", "fr-col-md-6")}
					style={{ display: "flex" }}
				>
					<PracticalGuide
						key={index}
						title={guide.title}
						slug={guide.slug}
						badge={theme?.name}
						description={guide.description}
						condition={condition?.slug}
						textColor={condition?.textColor}
						backgroundColor={condition?.backgroundColor}
					/>
				</div>
			);
		});
}
