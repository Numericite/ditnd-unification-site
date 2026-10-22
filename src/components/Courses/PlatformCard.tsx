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
	// "featured" : pleine largeur, image sur la moitié et bouton.
	// "half" : demi-largeur, image sur un tiers et lien flèche.
	variant: "featured" | "half";
};

export default function PlatformCard({ platform, variant }: Props) {
	const { classes, cx } = useStyles();

	const { badge, title, description, image, link } = platform;
	const imageUrl =
		(typeof image === "object" ? image?.url : null) ?? "/placeholder.16x9.png";

	const isExternal = link.url.startsWith("http");
	const linkTitle = isExternal
		? `${link.label} : ${title}, nouvelle fenêtre`
		: `${link.label} : ${title}`;
	const externalProps = isExternal
		? { target: "_blank", rel: "noopener noreferrer" }
		: {};

	const footer =
		variant === "featured" ? (
			isExternal ? (
				<Button
					iconId="fr-icon-external-link-line"
					iconPosition="right"
					linkProps={{ href: link.url, title: linkTitle, ...externalProps }}
				>
					{link.label}
				</Button>
			) : (
				<Button linkProps={{ href: link.url, title: linkTitle }}>
					{link.label}
				</Button>
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
				title={linkTitle}
				{...externalProps}
			>
				{link.label}
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
				title={linkTitle}
			>
				{link.label}
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
			titleAs="h3"
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

// Hauteurs de la maquette, appliquées seulement quand la carte est horizontale.
// minHeight laisse la carte grandir si le texte saisi dans le CMS est plus long.
const useStyles = tss.withName({ PlatformCard }).create(() => ({
	card: {
		height: "100%",
		"& .fr-card__desc": {
			whiteSpace: "pre-line",
		},
		// react-dsfr rend toujours un .fr-card__end, même vide : il ajoute 24px
		// entre la description et le lien.
		"& .fr-card__end": {
			display: "none",
		},
	},
	badge: {
		fontWeight: 500,
	},
	// Le DSFR remplace l'icône des liens target="_blank" par « lien externe » ;
	// la maquette veut la flèche. L'ouverture dans un nouvel onglet reste
	// annoncée par le title du lien.
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
