import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import type { Condition, Theme } from "~/payload/payload-types";
import { shortenDescription } from "~/utils/tools";
import { tss } from "tss-react/dsfr";

type Props = {
	title: string;
	description?: string;
	type?: "Webinaire" | "MOOC" | "Présentiel";
	imageUrl?: string;
	imageAlt?: string;
	noImg?: boolean;
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
	noImg,
	conditions,
	themes,
	kind = "guides",
	redirect = "/",
	titleAs = "h4",
}: Props) {
	const { classes, cx } = useStyles();

	const imgProps = !noImg
		? {
				imageUrl: imageUrl ?? "/placeholder.16x9.png",
				imageAlt: imageAlt ?? "",
			}
		: { imageComponent: undefined };

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
			desc={description ? shortenDescription(description) : undefined}
			{...imgProps}
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
				<div className={cx(classes.tags)}>
					<ul className={cx(fr.cx("fr-tags-group"), classes.tags)}>
						{conditions.map((condition) => (
							<li key={condition.id}>
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
				</div>
			}
			title={title}
			titleAs={titleAs}
		/>
	);
}

const useStyles = tss.withName(CardDisplay.name).create(() => ({
	tags: {
		ul: {
			paddingInlineStart: "0rem!important",
		},
	},
}));
