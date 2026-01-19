import { fr, type FrCxArg } from "@codegouvfr/react-dsfr";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import { PracticalGuide } from "./PracticalGuide";

type Props = {
	practicalGuides: AugmentedPracticalGuide[];
	md?: number;
	sm?: number;
	lg?: number;
};

export default function PracticalGuidesGroup({
	practicalGuides,
	md,
	sm,
	lg,
}: Props) {
	const medium = md ? (`fr-col-md-${md}` as FrCxArg) : "fr-col-md-6";
	const small = sm ? (`fr-col-sm-${sm}` as FrCxArg) : "fr-col-sm-12";
	const large = lg ? (`fr-col-lg-${lg}` as FrCxArg) : "fr-col-lg-4";
	const classNames: FrCxArg[] = ["fr-col-12", medium, small, large];
	return (
		<>
			{practicalGuides?.map((guide) => (
				<div
					key={guide.id}
					className={fr.cx(classNames)}
					style={{ display: "flex" }}
				>
					<PracticalGuide guide={guide} />
				</div>
			))}
		</>
	);
}
