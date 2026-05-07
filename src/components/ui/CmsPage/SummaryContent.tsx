import { fr } from "@codegouvfr/react-dsfr";
import Summary, { type SummaryProps } from "@codegouvfr/react-dsfr/Summary";
import type { Link } from "~/utils/tools";

type Props = {
	menuLinks: Link[];
	className?: string;
	title: string;
	as?: SummaryProps["as"];
};

export default function SummaryContent({
	menuLinks,
	className,
	title,
	as = "h2",
}: Props) {
	return (
		<div
			className={fr.cx(
				"fr-col-12",
				"fr-col-lg-3",
				"fr-col-md-12",
				"fr-col-sm-12",
				"fr-mb-2w",
			)}
		>
			<Summary
				id="summary"
				className={className}
				links={menuLinks}
				title={title}
				as={as}
			/>
		</div>
	);
}
