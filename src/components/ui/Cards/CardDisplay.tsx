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
	redirect: string;
	titleAs?: "h2" | "h3" | "h4" | "h5" | "h6" | undefined;
	horizontal?: boolean;
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
	redirect = "/",
	titleAs = "h4",
	horizontal = false,
}: Props) {
	const { classes, cx } = useStyles();

	const imgProps = !noImg
		? {
				imageUrl: imageUrl ?? "/placeholder.16x9.png",
				imageAlt: imageAlt ?? "",
				nativeImgProps: { role: "presentation" },
			}
		: { imageComponent: undefined };

	const isExternalLink = redirect.startsWith("http");
	const linkProps = isExternalLink
		? {
				href: redirect,
				target: "_blank",
				rel: "noopener noreferrer",
				title: `${title}, nouvelle fenêtre`,
				"aria-label": `${title}, nouvelle fenêtre`,
			}
		: { href: redirect };

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
			{...(horizontal ? { horizontal: true } : { horizontal: false })}
			desc={description ? shortenDescription(description) : undefined}
			enlargeLink
			linkProps={linkProps}
			{...imgProps}
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

const useStyles = tss.withName({ CardDisplay }).create(() => ({
	tags: {
		ul: {
			paddingInlineStart: "0rem!important",
		},
	},
}));
