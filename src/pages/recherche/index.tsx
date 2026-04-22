import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import Tabs from "@codegouvfr/react-dsfr/Tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Loader } from "~/components/ui/Loader";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import CardsDisplayGroup from "~/components/ui/Cards/CardsDisplayGroup";
import PageContent from "~/components/ui/PageContent";
import { tss } from "tss-react/dsfr";

export default function Recherche() {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");

	useEffect(() => {
		if (!router.isReady) return;
		const param =
			typeof router.query.search === "string" ? router.query.search : "";
		if (param) {
			setSearch(param);
			setQuery(param);
		}
	}, [router.isReady, router.query.search]);

	const { data, isLoading } = api.search.global.useQuery(
		{ text: query },
		{ enabled: query.length > 0 },
	);

	const guidesCount = data?.guides.length ?? 0;
	const coursesCount = data?.courses.length ?? 0;
	const totalCount = guidesCount + coursesCount;

	const handleSearch = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return;
		setQuery(trimmed);
		router.push(
			{ pathname: "/recherche", query: { search: trimmed } },
			undefined,
			{ shallow: true },
		);
	};

	return (
		<>
			<Head>
				<title>
					{query
						? `Recherche : ${query} - Maison de l'autisme`
						: "Recherche - Maison de l'autisme"}
				</title>
				<meta
					name="description"
					content="Recherchez parmi les fiches pratiques et formations sur l'autisme et les troubles du neurodéveloppement."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-8w")}>
				<Breadcrumb
					currentPageLabel="Recherche"
					homeLinkProps={{ href: "/" }}
					segments={[]}
				/>

				<PageContent>
					<h1 className={fr.cx("fr-mb-4w")}>Résultats de recherche</h1>

					<div className={fr.cx("fr-grid-row")}>
						<div className={fr.cx("fr-col-12", "fr-col-md-8")}>
							<SearchBar
								label="Rechercher un sujet, une thématique..."
								big
								onButtonClick={() => handleSearch(search)}
								renderInput={({ className, id, placeholder, type }) => (
									<input
										className={className}
										id={id}
										placeholder={placeholder}
										type={type}
										value={search}
										onChange={(e) => setSearch(e.currentTarget.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleSearch(search);
											}
										}}
									/>
								)}
							/>
						</div>
					</div>

					{!query ? (
						<p className={fr.cx("fr-mt-4w", "fr-text--lg")}>
							Saisissez un terme pour lancer la recherche.
						</p>
					) : isLoading ? (
						<EmptyScreenZone>
							<Loader />
						</EmptyScreenZone>
					) : (
						<div
							className={fr.cx(
								"fr-grid-row",
								"fr-grid-row--gutters",
								"fr-pt-3w",
							)}
						>
							<div
								className={fr.cx("fr-col-12")}
								style={{ textAlign: "right" }}
							>
								<output
									className={fr.cx("fr-text--sm", "fr-mb-0")}
									aria-live="polite"
								>
									{totalCount} {totalCount > 1 ? "résultats" : "résultat"}
								</output>
							</div>

							{totalCount === 0 ? (
								<div className={fr.cx("fr-callout")}>
									<p className={fr.cx("fr-callout__text")}>
										Aucun contenu ne correspond à votre recherche. Essayez avec
										d'autres termes ou consultez nos{" "}
										<a href="/fiches-pratiques">fiches pratiques</a> et{" "}
										<a href="/formations">formations</a>.
									</p>
								</div>
							) : (
								<Tabs
									label="Résultats de recherche par type de contenu"
									tabs={[
										{
											label: `Tout (${totalCount})`,
											isDefault: true,
											content: (
												<div className={fr.cx("fr-pt-2w")}>
													{guidesCount > 0 && (
														<section aria-labelledby="section-guides-all">
															<h2
																id="section-guides-all"
																className={fr.cx("fr-h4", "fr-mb-2w")}
															>
																Fiches pratiques ({guidesCount})
															</h2>
															<div
																className={fr.cx(
																	"fr-grid-row",
																	"fr-grid-row--gutters",
																)}
															>
																<CardsDisplayGroup
																	className={fr.cx(
																		"fr-col-12",
																		"fr-col-sm-6",
																		"fr-col-lg-4",
																	)}
																	guides={data?.guides}
																	kind="guides"
																	titleAs="h3"
																/>
															</div>
														</section>
													)}

													{coursesCount > 0 && (
														<section
															aria-labelledby="section-courses-all"
															className={cx(
																guidesCount > 0 ? classes.sectionSpacing : "",
															)}
														>
															<h2
																id="section-courses-all"
																className={fr.cx("fr-h4", "fr-mb-2w")}
															>
																Formations ({coursesCount})
															</h2>
															<div
																className={fr.cx(
																	"fr-grid-row",
																	"fr-grid-row--gutters",
																)}
															>
																<CardsDisplayGroup
																	className={fr.cx(
																		"fr-col-12",
																		"fr-col-sm-6",
																		"fr-col-lg-4",
																	)}
																	courses={data?.courses}
																	kind="courses"
																	titleAs="h3"
																/>
															</div>
														</section>
													)}
												</div>
											),
										},
										{
											label: `Fiches pratiques (${guidesCount})`,
											content:
												guidesCount > 0 ? (
													<div className={fr.cx("fr-pt-2w")}>
														<div
															className={fr.cx(
																"fr-grid-row",
																"fr-grid-row--gutters",
															)}
														>
															<CardsDisplayGroup
																className={fr.cx(
																	"fr-col-12",
																	"fr-col-sm-6",
																	"fr-col-lg-4",
																)}
																guides={data?.guides}
																kind="guides"
																titleAs="h3"
															/>
														</div>
													</div>
												) : (
													<p className={fr.cx("fr-mt-2w")}>
														Aucune fiche pratique trouvée pour cette recherche.
													</p>
												),
										},
										{
											label: `Formations (${coursesCount})`,
											content:
												coursesCount > 0 ? (
													<div className={fr.cx("fr-pt-2w")}>
														<div
															className={fr.cx(
																"fr-grid-row",
																"fr-grid-row--gutters",
															)}
														>
															<CardsDisplayGroup
																className={fr.cx(
																	"fr-col-12",
																	"fr-col-sm-6",
																	"fr-col-lg-4",
																)}
																courses={data?.courses}
																kind="courses"
																titleAs="h3"
															/>
														</div>
													</div>
												) : (
													<p className={fr.cx("fr-mt-2w")}>
														Aucune formation trouvée pour cette recherche.
													</p>
												),
										},
									]}
								/>
							)}
						</div>
					)}
				</PageContent>
			</div>
		</>
	);
}

const useStyles = tss.withName(Recherche.name).create({
	sectionSpacing: {
		marginTop: fr.spacing("6w"),
	},
});
