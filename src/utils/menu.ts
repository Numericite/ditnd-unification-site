import type { Menu } from "~/payload/payload-types";
import { normalizePath, referenceHref } from "./links";

export type LockedMenuItem = {
	key: "personas" | "practicalGuides" | "courses";
	title: string;
	activePaths: string[];
} & ({ href: string; submenu?: never } | { submenu: "personas"; href?: never });

// Libellés par défaut : renommables et masquables dans le global « menu »,
// mais pas déplaçables ni supprimables.
export const LOCKED_MENU_ITEMS: LockedMenuItem[] = [
	{
		key: "personas",
		title: "Je suis",
		activePaths: ["/parcours"],
		submenu: "personas",
	},
	{
		key: "practicalGuides",
		title: "Fiches pratiques",
		href: "/fiches-pratiques",
		activePaths: ["/fiches-pratiques"],
	},
	{
		key: "courses",
		title: "Formations",
		href: "/formations",
		activePaths: ["/formations"],
	},
];

export const resolveLockedItems = (
	menu: Pick<Menu, "lockedItems">,
): LockedMenuItem[] =>
	LOCKED_MENU_ITEMS.flatMap((item) => {
		const settings = menu.lockedItems?.[item.key];
		if (settings?.visible === false) return [];
		return [{ ...item, title: settings?.title?.trim() || item.title }];
	});

export const isPathActive = (currentHref: string, href: string) => {
	const current = normalizePath(currentHref);
	const path = normalizePath(href);
	return current === path || current.startsWith(`${path}/`);
};

export type NavLink = { title: string; href: string; external: boolean };

export type NavItem = NavLink | { title: string; children: NavLink[] };

type MenuItem = NonNullable<Menu["items"]>[number];
type MenuLink = NonNullable<MenuItem["link"]>;

const resolveLink = (
	title: string,
	link: MenuLink | null | undefined,
): NavLink | null => {
	if (!link) return null;
	if (link.type === "external") {
		const href = link.externalUrl?.trim();
		return href ? { title, href, external: true } : null;
	}
	const href =
		link.type === "internal"
			? link.internalUrl?.trim()
			: referenceHref(link.reference);
	return href ? { title, href, external: false } : null;
};

export const resolveLinks = (
	items: { title: string; link?: MenuLink | null }[] | null | undefined,
): NavLink[] =>
	(items ?? []).flatMap((item) => {
		const link = resolveLink(item.title, item.link);
		return link ? [link] : [];
	});

export const resolveMenu = (menu: Pick<Menu, "items">): NavItem[] =>
	(menu.items ?? []).flatMap((item): NavItem[] => {
		if (item.kind === "submenu") {
			const children = (item.children ?? []).flatMap((child) => {
				const link = resolveLink(child.title, child.link);
				return link ? [link] : [];
			});
			return children.length ? [{ title: item.title, children }] : [];
		}
		const link = resolveLink(item.title, item.link);
		return link ? [link] : [];
	});
