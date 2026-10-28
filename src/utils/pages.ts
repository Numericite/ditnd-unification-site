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
