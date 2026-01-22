import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import type { AugmentedCourse } from "~/server/api/routers/courses";

export default function Course({ course }: { course: AugmentedCourse }) {
	return (
		<div className="container">
			<Card
				background
				badge={
					<Badge noIcon severity="info">
						{course.type}
					</Badge>
				}
				border
				desc={course.description}
				imageAlt={course.image?.alt ?? ""}
				imageUrl={
					course.image?.url ??
					"https://www.systeme-de-design.gouv.fr/v1.14/storybook/img/placeholder.16x9.png"
				}
				footer={
					<a
						className="fr-link fr-icon-arrow-right-line fr-link--icon-right"
						href="/"
					>
						Voir la formation
					</a>
				}
				size="medium"
				start={
					<ul className="fr-tags-group">
						<li>
							<Tag
								style={{
									color: course.condition.textColor,
									backgroundColor: course.condition.backgroundColor,
								}}
							>
								<strong>{course.condition.acronym}</strong>
							</Tag>
						</li>
						<li>
							<Tag>
								<strong>{course.theme.name}</strong>
							</Tag>
						</li>
					</ul>
				}
				title={course.title}
				titleAs="h4"
			/>
		</div>
	);
}
