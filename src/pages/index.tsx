import Head from "next/head";
import { tss } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import { PersonaTiles } from "~/components/HomePage/PersonaTiles";
import MostViewedGuides from "~/components/HomePage/MostViewedGuides";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { homeCMSStore, personStore } from "~/state/store";
import { personsAndProTiles } from "~/utils/pictograms";
import PageContent from "~/components/ui/PageContent";
import NewsletterFollow from "~/components/ui/NewsletterFollow";
import { ContactInfos } from "~/components/HomePage/ContactInfos";
import { NEWSLETTER_ENABLED } from "~/utils/newsletter";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import NewsCarousel from "~/components/HomePage/NewsCarousel";
import type { AugmentedNews } from "~/server/api/routers/news";
import { getGlobalData } from "~/server/global-data";
import { type HomeSection, isSectionVisible } from "~/utils/homeSections";

type Props = {
	sections: HomeSection[];
	mostViewedGuides: AugmentedPracticalGuide[];
	latestNews: AugmentedNews[];
};

export default function Home({
	sections,
	mostViewedGuides,
	latestNews,
}: Props) {
	const { classes, cx } = useStyles();

	const persons = personStore.get();

	const homeCMS = homeCMSStore.get();

	const tiles = personsAndProTiles(persons);

	if (!homeCMS)
		return (
			<EmptyScreenZone>
				<p>
					Erreur lors du chargement des variables globales sur payload CMS,
					veuillez revoir la configuration de votre instance Payload.{" "}
				</p>
			</EmptyScreenZone>
		);

	const renderSection = (section: HomeSection, colored: boolean) => {
		switch (section.blockType) {
			case "contact":
				return <ContactInfos contactCMS={section} />;
			case "newsCarousel":
				return (
					<div className={fr.cx("fr-container")}>
						<div className={fr.cx("fr-py-4w")}>
							<NewsCarousel news={latestNews} />
						</div>
					</div>
				);
			case "personaTiles":
				return (
					<div className={fr.cx("fr-container")}>
						<div className={fr.cx("fr-py-6w")}>
							{persons ? (
								<PersonaTiles tiles={tiles} />
							) : (
								<div role="alert" aria-live="assertive">
									Aucun persona trouvé
								</div>
							)}
						</div>
					</div>
				);
			case "mostViewedGuides":
				return (
					<div className={fr.cx("fr-container")}>
						<div className={fr.cx("fr-py-4w")}>
							<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
								<div
									className={cx(
										fr.cx("fr-col-12"),
										classes.mostViewedContainer,
									)}
								>
									<h2>{section.title}</h2>
									<div className={cx(fr.cx("fr-text--sm"), classes.preLine)}>
										{section.description}
									</div>

									{mostViewedGuides.length === 0 ? (
										<div role="alert" aria-live="assertive">
											Aucune fiche pratique trouvée
										</div>
									) : (
										<MostViewedGuides guides={mostViewedGuides} />
									)}

									<a
										href="/fiches-pratiques"
										className={cx(
											fr.cx(
												"fr-link",
												"fr-icon-arrow-right-line",
												"fr-link--icon-right",
											),
											classes.viewMoreLink,
										)}
									>
										Voir toutes les fiches par thématiques
									</a>
								</div>
							</div>
						</div>
					</div>
				);
			case "newsletter":
				return (
					<NewsletterFollow
						content={section}
						className={colored ? undefined : classes.whiteFollow}
					/>
				);
		}
	};

	return (
		<>
			<Head>
				<title>Maison de l'autisme - Accueil</title>
				<meta
					name="description"
					content="Maison de l'autisme : site national d'informations pour toutes les personnes concernées par l'autisme et ses troubles associés. Retrouvez des ressources, diagnostics et formations."
				/>
			</Head>
			<PageContent>
				<div className={classes.coloredContainer}>
					<div className={cx(fr.cx("fr-container", "fr-py-5w"), classes.hero)}>
						<div className={classes.heroTitleRow}>
							<img
								className={classes.heroLogo}
								src="/filiere-tnd-logo.png"
								alt=""
								width={165}
								height={173}
							/>
							<h1 className={cx(fr.cx("fr-mb-0"), classes.heroTitle)}>
								{homeCMS.header.title.split(/\r?\n/).map((line, index) => (
									<span
										key={line}
										className={
											index === 0
												? classes.heroTitleLight
												: classes.heroTitleBold
										}
									>
										{line}
									</span>
								))}
							</h1>
						</div>
						{homeCMS.header.description && (
							<p
								className={cx(
									fr.cx("fr-text--lg", "fr-mt-3w", "fr-mb-0"),
									classes.preLine,
									classes.heroDescription,
								)}
							>
								{homeCMS.header.description}
							</p>
						)}
					</div>
				</div>
				{withBackgrounds(sections).map(({ section, top, bottom }) => (
					<div
						key={section.blockType}
						className={cx(
							top === bottom && top === "colored" && classes.coloredContainer,
							top !== bottom &&
								(top === "colored"
									? classes.coloredTopHalf
									: classes.coloredBottomHalf),
						)}
					>
						{renderSection(section, bottom === "colored")}
					</div>
				))}
			</PageContent>
		</>
	);
}

type Background = "colored" | "plain";

// The contact tiles straddle two backgrounds, so the contact section takes no
// slot in the alternation: its top half matches the section above (the colored
// header when it comes first) and its bottom half the section below.
function withBackgrounds(sections: HomeSection[]) {
	const backgroundAt = (slot: number): Background =>
		slot % 2 === 0 ? "plain" : "colored";
	let slot = 0;
	return sections.map((section) => {
		if (section.blockType === "contact") {
			return {
				section,
				top: backgroundAt(slot - 1),
				bottom: backgroundAt(slot),
			};
		}
		const background = backgroundAt(slot++);
		return { section, top: background, bottom: background };
	});
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const caller = createCaller(await createTRPCContext());
	const homeCMS = await getGlobalData()
		.then((data) => data.homeCMS)
		.catch(() => undefined);
	const visibleSections = (homeCMS?.sections ?? []).filter(isSectionVisible);
	const isVisible = (blockType: HomeSection["blockType"]) =>
		visibleSections.some((section) => section.blockType === blockType);

	const [mostViewedGuides, latestNews] = await Promise.all([
		isVisible("mostViewedGuides") ? caller.practicalGuide.getByViews() : [],
		isVisible("newsCarousel") ? caller.news.getAll() : [],
	]);

	const sections = visibleSections.filter((section) => {
		if (section.blockType === "newsCarousel") return latestNews.length > 0;
		if (section.blockType === "newsletter")
			return NEWSLETTER_ENABLED || (section.socials ?? []).length > 0;
		return true;
	});

	return {
		props: {
			sections,
			mostViewedGuides,
			latestNews,
		},
	};
};

const useStyles = tss.withName({ Home }).create({
	preLine: {
		whiteSpace: "pre-line",
	},
	hero: {
		textAlign: "center",
	},
	heroTitleRow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: fr.spacing("2w"),
		[fr.breakpoints.down("md")]: {
			flexDirection: "column",
		},
	},
	heroLogo: {
		flexShrink: 0,
		width: "5rem",
		height: "auto",
		[fr.breakpoints.down("md")]: {
			width: "3.5rem",
		},
	},
	heroTitle: {
		textAlign: "left",
		textTransform: "uppercase",
		fontSize: "1.625rem",
		lineHeight: 1.3,
		[fr.breakpoints.down("md")]: {
			fontSize: "1.125rem",
			textAlign: "center",
		},
	},
	heroDescription: {
		[fr.breakpoints.down("md")]: {
			fontSize: "1rem !important",
			lineHeight: "1.5rem !important",
		},
	},
	heroTitleLight: {
		display: "block",
		fontWeight: 400,
	},
	heroTitleBold: {
		display: "block",
		fontWeight: 800,
	},
	coloredContainer: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
	},
	coloredTopHalf: {
		background: `linear-gradient(to bottom, ${fr.colors.decisions.background.alt.blueFrance.default} 50%, transparent 50%)`,
	},
	coloredBottomHalf: {
		background: `linear-gradient(to bottom, transparent 50%, ${fr.colors.decisions.background.alt.blueFrance.default} 50%)`,
	},
	// DSFR Follow is styled for a blue background, including its buttons' hover/active states.
	whiteFollow: {
		"&&": {
			backgroundColor: "var(--background-default-grey)",
			"--hover": "var(--background-default-grey-hover)",
			"--active": "var(--background-default-grey-active)",
		},
	},
	mostViewedContainer: {
		display: "flex",
		flexDirection: "column",
	},
	viewMoreLink: {
		marginLeft: "auto",
		marginTop: fr.spacing("3w"),
	},
});
