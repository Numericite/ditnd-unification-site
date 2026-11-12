import type { Home } from "~/payload/payload-types";

export type HomeSection = NonNullable<Home["sections"]>[number];

type HomeSectionOf<T extends HomeSection["blockType"]> = Extract<
	HomeSection,
	{ blockType: T }
>;

export function findHomeSection<T extends HomeSection["blockType"]>(
	home: Home | undefined,
	blockType: T,
): HomeSectionOf<T> | undefined {
	return home?.sections?.find(
		(section): section is HomeSectionOf<T> => section.blockType === blockType,
	);
}

// The checkbox is null on rows saved before the field existed: treat it as shown.
export const isSectionVisible = (section: HomeSection | undefined) =>
	section?.visible !== false;
