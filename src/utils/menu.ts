import type { Menu } from "~/payload/payload-types";
import { referenceHref } from "./links";

// Éléments générés par le code (MainNavigation), toujours en tête du menu.
export const LOCKED_MENU_ITEMS = ["Je suis", "Fiches pratiques", "Me former"];

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

/**
 * Liens du global « menu » prêts à afficher. Un lien sans cible publiée est
 * ignoré, ainsi qu'un sous-menu qui ne contient plus aucun lien.
 */
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
