import Head from "next/head";
import { tss } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import { PersonaTiles } from "~/components/HomePage/PersonaTiles";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import MostViewedGuides from "~/components/HomePage/MostViewedGuides";
import { useState } from "react";
import { useRouter } from "next/router";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { homeCMSStore, personStore } from "~/state/store";
import { personsAndProTiles } from "~/utils/pictograms";
import Image from "next/image";
import PageContent from "~/components/ui/PageContent";
import NewsletterFollow from "~/components/ui/NewsletterFollow";
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

	const [search, setSearch] = useState("");

	const router = useRouter();

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
				<div className={fr.cx("fr-container", "fr-my-8w")}>
					<div className={fr.cx("fr-py-4w")}>
						<div
							className={cx(
								fr.cx("fr-grid-row", "fr-grid-row--gutters"),
								classes.headerRow,
							)}
						>
							<div className={fr.cx("fr-col-12", "fr-col-md-6")}>
								<h1>{homeCMS.header.title}</h1>
								<p className={classes.preLine}>{homeCMS.header.description}</p>
								<SearchBar
									big
									onButtonClick={() =>
										router.push(`/recherche?search=${search}`)
									}
									renderInput={({ className, id, placeholder, type }) => (
										<input
											className={className}
											id={id}
											placeholder={placeholder}
											type={type}
											value={search}
											onChange={(event) => {
												if (event.currentTarget.value === "") setSearch("");
												setSearch(event.currentTarget.value);
											}}
										/>
									)}
								/>
							</div>
							<div
								className={cx(
									fr.cx("fr-col-12", "fr-col-md-6"),
									classes.headerImageContainer,
								)}
							>
								<Image
									alt=""
									role="presentation"
									width={400}
									height={400}
									fetchPriority="high"
									priority
									loading="eager"
									src={"/HomePageIllustration.svg"}
								/>
							</div>
						</div>
					</div>
				</div>
				{sections.map((section, index) => (
					<div
						key={section.blockType}
						className={cx(index % 2 === 0 && classes.coloredContainer)}
					>
						{renderSection(section, index % 2 === 0)}
					</div>
				))}
			</PageContent>
		</>
	);
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
		if (section.blockType === "newsletter") return NEWSLETTER_ENABLED;
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
	headerRow: {
		alignContent: "center",
		alignItems: "center",
	},
	headerImageContainer: {
		display: "flex",
		justifyContent: "center",
		[fr.breakpoints.down("md")]: {
			display: "none",
		},
	},
	preLine: {
		whiteSpace: "pre-line",
	},
	coloredContainer: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
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
