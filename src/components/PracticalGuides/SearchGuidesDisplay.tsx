import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import { keepPreviousData } from "@tanstack/react-query";
import type { FiltersQuery } from "./GuidesFiltersDisplay";
import { useEffect, useRef, useState } from "react";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { Loader } from "../ui/Loader";
import CardsDisplayGroup from "../ui/Cards/CardsDisplayGroup";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { EmptyScreenZone } from "../ui/EmptyScreenZone";
import { DEFAULT_PAGE_SIZE } from "~/utils/pagination";

const parsePage = (value: string | string[] | undefined): number => {
	const raw = Array.isArray(value) ? value[0] : value;
	const parsed = raw ? parseInt(raw, 10) : 1;
	return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
};

export const SearchGuidesDisplay = ({ filters }: { filters: FiltersQuery }) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const search = searchParams?.get("search");

	const [query, setQuery] = useState<string>(search ?? "");

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

	const { data, isLoading } = api.practicalGuide.getByFilters.useQuery(
		{ ...filters, text: query, page, limit: DEFAULT_PAGE_SIZE },
		{ placeholderData: keepPreviousData },
	);

	const items = data?.items;
	const total = data?.total ?? 0;
	const pageCount = data?.pageCount ?? 0;

	return (
		<>
			<SearchBarUI value={query} onClick={(query) => setQuery(query)} />
			{isLoading && !data ? (
				<EmptyScreenZone>
					<Loader />
				</EmptyScreenZone>
			) : !items || items.length === 0 ? (
				<div className={fr.cx("fr-my-2w")} role="alert" aria-live="assertive">
					Aucune fiche pratique trouvée
				</div>
			) : (
				<div
					id="results"
					tabIndex={-1}
					className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-pt-3w")}
				>
					<div className={fr.cx("fr-col-12")} style={{ textAlign: "right" }}>
						<output
							className={fr.cx("fr-text--sm", "fr-mb-0")}
							aria-live="polite"
						>
							{total} {total > 1 ? "résultats" : "résultat"}
						</output>
					</div>
					<CardsDisplayGroup
						className={fr.cx("fr-col-lg-6")}
						guides={items}
						kind="guides"
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
