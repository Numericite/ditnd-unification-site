import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useState } from "react";
import { tss } from "tss-react/dsfr";
import type { AugmentedNews } from "~/server/api/routers/news";

export default function NewsCarousel({ news }: { news: AugmentedNews[] }) {
	const { classes } = useStyles();
	const [index, setIndex] = useState(0);

	if (!news.length) return null;

	const total = news.length;
	const current = news[index]!;

	const imageUrl = current.image?.url ?? "";

	return (
		<section aria-label="À la une" className={classes.root}>
			<div className={classes.header}>
				<h2 className={classes.title}>À la une</h2>
				{total > 1 && (
					<div className={classes.controls}>
						<p className={classes.counter} aria-hidden="true">
							{index + 1} / {total}
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
				imageUrl={imageUrl}
				imageAlt=""
				nativeImgProps={{ role: "presentation" }}
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
					<Button
						iconId="fr-icon-external-link-line"
						iconPosition="right"
						style={{ visibility: current.link?.url ? "visible" : "hidden" }}
						linkProps={{
							href: current.link?.url ?? "#",
							target: "_blank",
							rel: "noopener noreferrer",
							tabIndex: current.link?.url ? 0 : -1,
							"aria-hidden": !current.link?.url,
						}}
					>
						{current.link?.label || "En savoir plus"}
					</Button>
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
