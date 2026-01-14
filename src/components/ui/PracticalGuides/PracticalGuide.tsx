import { Card } from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import type { Condition } from "~/payload/payload-types";

type Props = {
	title: string;
	description: string;
	slug: string;
	badge?: string;
	conditions?: Condition[];
	textColor?: string;
	backgroundColor?: string;
};

export const PracticalGuide = ({
	title,
	description,
	slug,
	badge,
	conditions,
}: Props) => {
	return (
		<div className="container">
			<Card
				border
				start={
					<ul className="fr-tags-group">
						{conditions?.map((condition, index) => (
							<li key={index}>
								<Tag
									style={{
										color: condition.textColor,
										backgroundColor: condition.backgroundColor,
									}}
								>
									<strong>{condition.slug.toUpperCase()}</strong>
								</Tag>
							</li>
						))}
						{badge && (
							<li>
								<Tag>
									<strong>{badge}</strong>
								</Tag>
							</li>
						)}
					</ul>
				}
				desc={description}
				footer={
					<a
						className="fr-link fr-icon-arrow-right-line fr-link--icon-right"
						href={`/guides/${slug}`}
					>
						Voir la fiche
					</a>
				}
				size="medium"
				title={title}
				titleAs="h4"
			/>
		</div>
	);
};
