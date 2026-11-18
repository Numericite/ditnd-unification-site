export const PAGE_SECTIONS = [
	{ label: "À propos", value: "a-propos" },
] as const;

export type PageSection = (typeof PAGE_SECTIONS)[number]["value"];

export const PAGE_SECTION_RESERVED_SLUGS: Record<PageSection, string[]> = {
	"a-propos": ["glossaire"],
};

export const pageSection = (value: string | null | undefined) =>
	PAGE_SECTIONS.find((section) => section.value === value);

export const pagePath = ({
	slug,
	section,
}: {
	slug?: string | null;
	section?: string | null;
}) => (section ? `/${section}/${slug}` : `/${slug}`);

const COLLECTION_PATHS: Record<string, string> = {
	"practical-guides": "/fiches-pratiques",
	courses: "/formations",
};

export const documentPath = (
	collection: string | undefined,
	doc: { slug?: string | null; section?: string | null },
) => {
	if (!doc.slug) return null;
	if (collection === "pages") return pagePath(doc);
	const basePath = collection ? COLLECTION_PATHS[collection] : undefined;
	return basePath ? `${basePath}/${doc.slug}` : null;
};
