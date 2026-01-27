import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import CardDisplay from "../Courses/CardDisplay";

type Props = {
	practicalGuides: AugmentedPracticalGuide[];
	className?: string;
};

export default function PracticalGuidesGroup({
	practicalGuides,
	className,
}: Props) {
	return (
		<>
			{practicalGuides?.map((guide) => (
				<div key={guide.id} className={className} style={{ display: "flex" }}>
					<CardDisplay
						title={guide.title}
						description={guide.description}
						imageUrl={guide.image?.url ?? undefined}
						imageAlt={guide.image?.alt}
						conditions={guide.conditions ?? []}
						themes={guide.themes}
						redirect={`/guides/${guide.slug}`}
					/>
				</div>
			))}
		</>
	);
}
