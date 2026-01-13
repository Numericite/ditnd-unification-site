import { Card } from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";

type Props = {
	title: string;
	description: string;
	slug: string;
	badge?: string;
	condition?: string;
	textColor?: string;
	backgroundColor?: string;
};

export const PracticalGuide = ({
	title,
	description,
	slug,
	badge,
	condition,
	textColor,
	backgroundColor,
}: Props) => {
	return (
		<div className="container">
			<Card
				border
				start={
					<ul className="fr-tags-group">
						{condition && (
							<li>
								<Tag
									style={{
										color: textColor,
										backgroundColor: backgroundColor,
									}}
								>
									<strong>{condition.toUpperCase()}</strong>
								</Tag>
							</li>
						)}
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
