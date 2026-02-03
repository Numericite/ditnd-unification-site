import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import type { Condition, Theme } from "~/payload/payload-types";
import { shortenDescription } from "~/utils/tools";

type Props = {
	title: string;
	description: string;
	type?: "Webinaire" | "MOOC" | "Présentiel";
	imageUrl?: string;
	imageAlt?: string;
	conditions: Condition[];
	themes: Theme[];
	kind?: "guides" | "courses";
	redirect: string;
	titleAs?: "h2" | "h3" | "h4" | "h5" | "h6" | undefined;
};

export default function CardDisplay({
	title,
	description,
	type,
	imageUrl,
	imageAlt,
	conditions,
	themes,
	kind = "guides",
	redirect = "/",
	titleAs = "h4",
}: Props) {
	return (
		<Card
			background
			badge={
				type ? (
					<Badge noIcon severity="info">
						{type}
					</Badge>
				) : null
			}
			border
			desc={shortenDescription(description)}
			imageAlt={imageAlt ?? ""}
			imageUrl={
				imageUrl ??
				"https://www.systeme-de-design.gouv.fr/v1.14/storybook/img/placeholder.16x9.png"
			}
			footer={
				<a
					className="fr-link fr-icon-arrow-right-line fr-link--icon-right"
					href={redirect}
				>
					{kind === "courses" ? "Voir la formation" : "Voir la fiche"}
				</a>
			}
			size="medium"
			start={
				<ul className="fr-tags-group">
					{conditions.map((condition, index) => (
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
					{themes.map((theme, index) => (
						<li key={index}>
							<Tag>
								<strong>{theme.name}</strong>
							</Tag>
						</li>
					))}
				</ul>
			}
			title={title}
			titleAs={titleAs}
		/>
	);
}
