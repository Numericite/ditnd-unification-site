export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

// Upper bound on candidates returned by vector / keyword search when a text query is active.
// Beyond this, users should refine their search rather than paginate further.
export const VECTOR_SEARCH_CAP = 200;

export interface PaginatedResult<T> {
	items: T[];
	total: number;
	pageCount: number;
	page: number;
	limit: number;
}

export const emptyPage = <T>(
	page: number,
	limit: number,
): PaginatedResult<T> => ({
	items: [],
	total: 0,
	pageCount: 0,
	page,
	limit,
});
