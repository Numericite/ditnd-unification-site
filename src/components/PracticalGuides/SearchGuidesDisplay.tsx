import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import type { FiltersQuery } from "./GuidesFiltersDisplay";
import { useEffect, useRef, useState } from "react";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { Loader } from "../ui/Loader";
import CardsDisplayGroup from "../ui/Cards/CardsDisplayGroup";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { EmptyScreenZone } from "../ui/EmptyScreenZone";
import { ResultsCount } from "../ui/SearchPage/ResultsCount";
import { DEFAULT_PAGE_SIZE, type PaginatedResult } from "~/utils/pagination";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

const parsePage = (value: string | string[] | undefined): number => {
	const raw = Array.isArray(value) ? value[0] : value;
	const parsed = raw ? parseInt(raw, 10) : 1;
	return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
};

type Props = {
	filters: FiltersQuery;
	initialFilters?: FiltersQuery;
	initialQuery?: string;
	initialPage?: number;
	initialData?: PaginatedResult<AugmentedPracticalGuide>;
};

const filtersAreEqual = (a: FiltersQuery, b: FiltersQuery) => {
	const sameArray = (x: string[], y: string[]) =>
		x.length === y.length && x.every((v, i) => v === y[i]);
	return (
		sameArray(a.conditions, b.conditions) &&
		sameArray(a.themes, b.themes) &&
		sameArray(a.personas, b.personas)
	);
};

export const SearchGuidesDisplay = ({
	filters,
	initialFilters,
	initialQuery,
	initialPage,
	initialData,
}: Props) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const search = searchParams?.get("search");

	const [query, setQuery] = useState<string>(search ?? initialQuery ?? "");

	const page = parsePage(router.query.page);

	const setPage = (nextPage: number) => {
		if (!router.isReady) return;
		const nextQuery = { ...router.query };
		if (nextPage <= 1) {
			delete nextQuery.page;
		} else {
			nextQuery.page = String(nextPage);
		}
		router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
			shallow: true,
		});
	};

	// Reset to page 1 when filters/search in the URL change. Based on URL state
	// (the source of truth) rather than local state so that hydration on the
	// pages router — where router.query populates after the first render — never
	// strips the `page` param on reload or browser back navigation.
	const normalizeQueryValue = (value: string | string[] | undefined) =>
		Array.isArray(value) ? value.join(",") : (value ?? "");
	const filterKey = [
		normalizeQueryValue(router.query.conditions),
		normalizeQueryValue(router.query.themes),
		normalizeQueryValue(router.query.personas),
		normalizeQueryValue(router.query.search),
	].join("|");

	const committedFilterKey = useRef<string | null>(null);
	useEffect(() => {
		if (!router.isReady) return;
		if (committedFilterKey.current === null) {
			committedFilterKey.current = filterKey;
			return;
		}
		if (committedFilterKey.current !== filterKey) {
			committedFilterKey.current = filterKey;
			if (page !== 1) setPage(1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterKey, router.isReady]);

	const matchesInitialQueryKey =
		initialData !== undefined &&
		query === (initialQuery ?? "") &&
		page === (initialPage ?? 1) &&
		(initialFilters ? filtersAreEqual(filters, initialFilters) : true);

	const { data, isLoading } = api.practicalGuide.getByFilters.useQuery(
		{ ...filters, text: query, page, limit: DEFAULT_PAGE_SIZE },
		matchesInitialQueryKey ? { initialData } : {},
	);

	const items = data?.items;
	const total = data?.total ?? 0;
	const pageCount = data?.pageCount ?? 0;

	const hasResults = !!items && items.length > 0;

	return (
		<>
			<SearchBarUI value={query} onClick={(query) => setQuery(query)} />
			<ResultsCount total={total} hidden={isLoading} />
			{isLoading ? (
				<EmptyScreenZone>
					<Loader />
				</EmptyScreenZone>
			) : !hasResults ? (
				<div id="results" tabIndex={-1} className={fr.cx("fr-my-2w")}>
					Aucune fiche pratique trouvée
				</div>
			) : (
				<div
					id="results"
					tabIndex={-1}
					className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-pt-3w")}
				>
					<h2 className="fr-sr-only">Résultats de recherche</h2>
					<CardsDisplayGroup
						className={fr.cx("fr-col-lg-6")}
						guides={items}
						kind="guides"
						titleAs="h3"
					/>
					{pageCount > 1 && (
						<div
							className={fr.cx("fr-col-12", "fr-mt-4w")}
							style={{ display: "flex", justifyContent: "center" }}
						>
							<Pagination
								count={pageCount}
								defaultPage={page}
								getPageLinkProps={(pageNumber) => ({
									onClick: (e) => {
										e.preventDefault();
										setPage(pageNumber);
										document
											.getElementById("results")
											?.scrollIntoView({ behavior: "smooth", block: "start" });
									},
									href: `?page=${pageNumber}`,
								})}
							/>
						</div>
					)}
				</div>
			)}
		</>
	);
};
