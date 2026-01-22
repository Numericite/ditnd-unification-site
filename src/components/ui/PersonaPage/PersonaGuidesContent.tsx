import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import { PracticalGuide } from "../PracticalGuides/PracticalGuide";
import { fr } from "@codegouvfr/react-dsfr";
import { slugify } from "~/utils/tools";

type Props = {
	value: AugmentedPracticalGuide[];
	chapterName: string;
};

export function practicalGuideQuery(
	pg: AugmentedPracticalGuide,
	condition: string,
	query: string,
) {
	return (
		pg.conditions.some((c) => c.slug === condition) ||
		(pg.conditions.length === 0 &&
			(pg.description.toLowerCase().includes(query) ||
				pg.title.toLowerCase().includes(query) ||
				pg.conditions.some((c) => c.slug.toLowerCase().includes(query)) ||
				pg.themes.some((theme) => theme.name.toLowerCase().includes(query))))
	);
}

export default function PersonaGuidesContent({ value, chapterName }: Props) {
	return (
		<>
			<h3 className={fr.cx("fr-pt-3w")} id={slugify(chapterName)}>
				{chapterName}
			</h3>

			<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
				{value.map((guide, index) => (
					<div
						key={index}
						className={fr.cx("fr-col-12", "fr-col-md-6")}
						style={{ display: "flex" }}
					>
						<PracticalGuide guide={guide} />
					</div>
				))}
			</div>
		</>
	);
}
