import { Card } from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import { shortenDescription } from "~/utils/tools";

type Props = {
	guide: AugmentedPracticalGuide;
};

export const PracticalGuide = ({ guide }: Props) => {
	return (
		<div className="container">
			<Card
				border
				start={
					<ul className="fr-tags-group">
						{guide.conditions?.map((condition, index) => (
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
						{guide.themes?.map((theme, index) => (
							<li key={index}>
								<Tag>
									<strong>{theme.name}</strong>
								</Tag>
							</li>
						))}
					</ul>
				}
				desc={shortenDescription(guide.description)}
				footer={
					<a
						className="fr-link fr-icon-arrow-right-line fr-link--icon-right"
						href={`/guides/${guide.slug}`}
					>
						Voir la fiche
					</a>
				}
				size="medium"
				title={guide.title}
				titleAs="h4"
			/>
		</div>
	);
};
