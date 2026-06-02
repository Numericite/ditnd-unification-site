import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import Tabs from "@codegouvfr/react-dsfr/Tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Loader } from "~/components/ui/Loader";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import CardsDisplayGroup from "~/components/ui/Cards/CardsDisplayGroup";
import { ResultsCount } from "~/components/ui/SearchPage/ResultsCount";
import PageContent from "~/components/ui/PageContent";
import { tss } from "tss-react/dsfr";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { GlobalSearchResult } from "~/server/api/routers/search";

type Props = {
	initialQuery: string;
	initialData: GlobalSearchResult | null;
};

export default function Recherche({ initialQuery, initialData }: Props) {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const [search, setSearch] = useState(initialQuery);
	const [query, setQuery] = useState(initialQuery);

	useEffect(() => {
		if (!router.isReady) return;
		const param =
			typeof router.query.search === "string" ? router.query.search : "";
		if (param !== query) {
			setSearch(param);
			setQuery(param);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady, router.query.search]);

	const { data, isLoading } = api.search.global.useQuery(
		{ text: query },
		{
			enabled: query.length > 0,
			...(initialData && query === initialQuery && initialQuery.length > 0
				? { initialData }
				: {}),
		},
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
					) : (
						<>
							<ResultsCount total={totalCount} hidden={isLoading} />
							{isLoading ? (
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
									{data?.glossary && (
										<div className={fr.cx("fr-col-12")}>
											<CallOut
												className={fr.cx("fr-mb-0")}
												title={data.glossary.name}
												buttonProps={
													data.glossary.link
														? {
																children: "Consulter la source",
																linkProps: {
																	href: data.glossary.link,
																	target: "_blank",
																	rel: "noopener noreferrer",
																},
															}
														: undefined
												}
											>
												{data.glossary.description}
											</CallOut>
										</div>
									)}
									{totalCount === 0 ? (
										<div className={fr.cx("fr-callout")}>
											<p className={fr.cx("fr-callout__text")}>
												Aucun contenu ne correspond à votre recherche. Essayez
												avec d'autres termes ou consultez nos{" "}
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
																		guidesCount > 0
																			? classes.sectionSpacing
																			: "",
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
																Aucune fiche pratique trouvée pour cette
																recherche.
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
						</>
					)}
				</PageContent>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const initialQuery =
		typeof ctx.query.search === "string" ? ctx.query.search.trim() : "";

	if (!initialQuery) {
		return {
			props: {
				initialQuery: "",
				initialData: null,
			},
		};
	}

	const caller = createCaller(await createTRPCContext());

	try {
		const initialData = await caller.search.global({ text: initialQuery });
		return {
			props: {
				initialQuery,
				initialData,
			},
		};
	} catch (err) {
		console.error("[recherche] SSR search failed:", err);
		return {
			props: {
				initialQuery,
				initialData: null,
			},
		};
	}
};

const useStyles = tss.withName(Recherche.name).create({
	sectionSpacing: {
		marginTop: fr.spacing("6w"),
	},
});
