import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useId, useState } from "react";
import { tss } from "tss-react/dsfr";
import type { AugmentedNews } from "~/server/api/routers/news";

export default function NewsCarousel({ news }: { news: AugmentedNews[] }) {
	const { classes } = useStyles();
	const [index, setIndex] = useState(0);
	const titleId = useId();

	if (!news.length) return null;

	const total = news.length;
	const current = news[index]!;

	const imageProps = current.image?.url
		? {
				imageUrl: current.image.url,
				imageAlt: "",
				nativeImgProps: { role: "presentation" },
			}
		: {};

	const linkLabel = current.link?.label || "En savoir plus";

	return (
		<section
			aria-labelledby={titleId}
			aria-roledescription="carrousel"
			className={classes.root}
		>
			<div className={classes.header}>
				<h2 id={titleId} className={classes.title}>
					À la une
				</h2>
				{total > 1 && (
					<div className={classes.controls}>
						<p className={classes.counter} aria-hidden="true">
							{index + 1} / {total}
						</p>
						<p className={fr.cx("fr-sr-only")} aria-live="polite" aria-atomic>
							Actualité {index + 1} sur {total} : {current.title}
						</p>
						<Button
							iconId="fr-icon-arrow-left-s-line"
							priority="tertiary"
							title="Actualité précédente"
							onClick={() => setIndex((i) => (i - 1 + total) % total)}
							nativeButtonProps={{ "aria-label": "Actualité précédente" }}
						/>
						<Button
							iconId="fr-icon-arrow-right-s-line"
							priority="tertiary"
							title="Actualité suivante"
							onClick={() => setIndex((i) => (i + 1) % total)}
							nativeButtonProps={{ "aria-label": "Actualité suivante" }}
						/>
					</div>
				)}
			</div>
			<Card
				background
				border
				horizontal
				size="medium"
				className={`fr-card--horizontal-half ${classes.card}`}
				title={current.title}
				titleAs="h3"
				desc={current.description ?? undefined}
				{...imageProps}
				start={
					current.category || current.personas?.length ? (
						<ul className={`${fr.cx("fr-tags-group")} ${classes.tags}`}>
							{current.category && (
								<li className={classes.categoryItem}>
									<Badge noIcon severity="info">
										{current.category}
									</Badge>
								</li>
							)}
							{current.personas?.map((persona) => (
								<li key={persona.id} className={classes.tagItem}>
									<Tag small>
										<strong>{persona.name}</strong>
									</Tag>
								</li>
							))}
						</ul>
					) : undefined
				}
				footer={
					current.link?.url ? (
						<Button
							iconId="fr-icon-external-link-line"
							iconPosition="right"
							linkProps={{
								href: current.link.url,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": `${linkLabel} : ${current.title}, nouvelle fenêtre`,
								title: `${linkLabel} : ${current.title}, nouvelle fenêtre`,
							}}
						>
							{linkLabel}
						</Button>
					) : (
						// Réserve la hauteur du bouton pour éviter que le carrousel saute d'une actu à l'autre
						<div className={classes.footerPlaceholder} />
					)
				}
			/>
		</section>
	);
}

const useStyles = tss.withName({ NewsCarousel }).create(() => ({
	root: {
		marginBottom: fr.spacing("3w"),
	},
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: fr.spacing("2w"),
	},
	title: {
		margin: 0,
	},
	controls: {
		display: "flex",
		alignItems: "center",
		gap: fr.spacing("2v"),
	},
	counter: {
		margin: 0,
		color: fr.colors.decisions.text.mention.grey.default,
		fontSize: "0.875rem",
		lineHeight: "1.5rem",
		fontVariantNumeric: "tabular-nums",
	},
	card: {
		"& .fr-card__end": {
			display: "none",
		},
		"& .fr-card__desc": {
			display: "-webkit-box",
			WebkitLineClamp: 4,
			WebkitBoxOrient: "vertical",
			overflow: "hidden",
			minHeight: "6rem",
		},
	},
	footerPlaceholder: {
		minHeight: "2.5rem",
	},
	tags: {
		alignItems: "center",
	},
	tagItem: {
		display: "flex",
		alignItems: "center",
	},
	categoryItem: {
		display: "flex",
		alignItems: "center",
		margin: "0 .25rem .5rem",
		"& .fr-badge": {
			fontSize: "12px",
		},
	},
}));
