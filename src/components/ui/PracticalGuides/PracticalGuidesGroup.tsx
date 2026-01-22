import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import { PracticalGuide } from "./PracticalGuide";

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
					<PracticalGuide guide={guide} />
				</div>
			))}
		</>
	);
}
