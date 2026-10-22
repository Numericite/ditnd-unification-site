import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import Link from "next/link";
import { tss } from "tss-react/dsfr";
import type { CoursesPage } from "~/payload/payload-types";

export type Platform = CoursesPage["platforms"]["featured"];

type Props = {
	platform: Platform;
	variant: "featured" | "half";
};

export default function PlatformCard({ platform, variant }: Props) {
	const { classes, cx } = useStyles();

	const { badge, title, description, image, link } = platform;
	const imageUrl =
		(typeof image === "object" ? image?.url : null) ?? "/placeholder.16x9.png";

	const isExternal = link.url.startsWith("http");
	const externalProps = isExternal
		? {
				target: "_blank",
				rel: "noopener noreferrer",
				title: `${link.label} - nouvelle fenêtre`,
			}
		: {};
	const linkContent = (
		<>
			{link.label}
			{isExternal && (
				<span className={fr.cx("fr-sr-only")}> - nouvelle fenêtre</span>
			)}
		</>
	);

	const footer =
		variant === "featured" ? (
			isExternal ? (
				<Button
					iconId="fr-icon-external-link-line"
					iconPosition="right"
					linkProps={{ href: link.url, ...externalProps }}
				>
					{linkContent}
				</Button>
			) : (
				<Button linkProps={{ href: link.url }}>{linkContent}</Button>
			)
		) : isExternal ? (
			<a
				className={cx(
					fr.cx(
						"fr-link",
						"fr-icon-arrow-right-line",
						"fr-link--icon-right",
						"fr-link--sm",
					),
					classes.arrowLink,
				)}
				href={link.url}
				{...externalProps}
			>
				{linkContent}
			</a>
		) : (
			<Link
				className={fr.cx(
					"fr-link",
					"fr-icon-arrow-right-line",
					"fr-link--icon-right",
					"fr-link--sm",
				)}
				href={link.url}
			>
				{linkContent}
			</Link>
		);

	return (
		<Card
			border
			horizontal
			size={variant === "featured" ? "large" : "medium"}
			className={cx(
				variant === "featured"
					? "fr-card--horizontal-half"
					: "fr-card--horizontal-tier",
				classes.card,
				variant === "featured" ? classes.featured : classes.half,
			)}
			title={title}
			titleAs="h2"
			desc={description}
			imageUrl={imageUrl}
			imageAlt=""
			nativeImgProps={{ role: "presentation" }}
			start={
				badge ? (
					<ul className={fr.cx("fr-tags-group")}>
						<li>
							<Tag className={variant === "half" ? classes.badge : undefined}>
								{badge}
							</Tag>
						</li>
					</ul>
				) : undefined
			}
			footer={footer}
		/>
	);
}

const useStyles = tss.withName({ PlatformCard }).create(() => ({
	card: {
		height: "100%",
		"& .fr-card__desc": {
			whiteSpace: "pre-line",
		},
		"& .fr-card__end": {
			display: "none",
		},
	},
	badge: {
		fontWeight: 500,
	},
	arrowLink: {
		"&[target=_blank]::after": {
			maskImage: 'url("/dsfr-icons/arrow-right-line.svg")',
			WebkitMaskImage: 'url("/dsfr-icons/arrow-right-line.svg")',
		},
	},
	featured: {
		"& .fr-card__desc": {
			marginTop: "2rem",
		},
		"& .fr-card__content": {
			marginBottom: "1.5rem",
		},
		[fr.breakpoints.up("md")]: {
			minHeight: "396px",
		},
	},
	half: {
		[fr.breakpoints.up("md")]: {
			minHeight: "456px",
		},
	},
}));
