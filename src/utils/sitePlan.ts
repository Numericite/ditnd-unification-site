import { normalizePath } from "./links";
import type { LockedMenuItem, NavItem } from "./menu";
import { sectionPath } from "./pages";

export type SitePlanEntry = {
	title: string;
	href?: string;
	external?: boolean;
	linkTitle?: string;
	children: SitePlanEntry[];
};

type PlanLink = { title: string; href: string };

export type SitePlanInput = {
	lockedMenu: LockedMenuItem[];
	menu: NavItem[];
	personas: { slug: string; name: string }[];
	conditions: { slug: string; name: string; acronym?: string | null }[];
	sections: {
		section: { slug: string; title: string };
		links: PlanLink[];
	}[];
	rootPages: PlanLink[];
};

// Pages hors CMS que le menu peut ne pas lister.
const FIXED_PAGES: PlanLink[] = [
	{ title: "Fiches pratiques", href: "/fiches-pratiques" },
	{ title: "Formations", href: "/formations" },
	{ title: "Glossaire", href: "/glossaire" },
];

/**
 * Plan du site calqué sur le menu principal : un groupe par élément du menu,
 * dans le même ordre. Un lien vers une rubrique liste ses pages. Les pages
 * absentes du menu rejoignent le sous-menu qui liste déjà des pages de leur
 * rubrique, sinon elles suivent, pour que le plan reste exhaustif. Une page
 * n'est listée qu'une fois, sauf si le menu lui-même la répète.
 */
export const buildSitePlan = ({
	lockedMenu,
	menu,
	personas,
	conditions,
	sections,
	rootPages,
}: SitePlanInput): SitePlanEntry[] => {
	const listed = new Set<string>();
	const sectionsByPath = new Map(
		sections.map((section) => [
			normalizePath(sectionPath(section.section.slug)),
			section,
		]),
	);
	const isListed = (href: string) => listed.has(normalizePath(href));

	// Liens explicites du menu : une rubrique ne les reprend pas sous son lien.
	const menuPaths = new Set(
		[
			...lockedMenu.flatMap((item) => (item.href ? [item.href] : [])),
			...menu.flatMap((item) =>
				"children" in item
					? item.children.filter((c) => !c.external).map((c) => c.href)
					: item.external
						? []
						: [item.href],
			),
		].map(normalizePath),
	);

	const entry = (
		title: string,
		href: string,
		external = false,
	): SitePlanEntry => {
		if (external) return { title, href, external, children: [] };
		const path = normalizePath(href);
		listed.add(path);
		const section = sectionsByPath.get(path);
		return {
			title,
			href,
			children: (section?.links ?? [])
				.filter(
					(link) =>
						!isListed(link.href) && !menuPaths.has(normalizePath(link.href)),
				)
				.map((link) => entry(link.title, link.href)),
		};
	};

	const personaEntries = () =>
		personas.map((persona) => {
			const href = `/parcours/${persona.slug}`;
			listed.add(normalizePath(href));
			return {
				title: persona.name,
				href,
				children: conditions.map((condition) => {
					const title = `par le ${condition.acronym || condition.name}`;
					return {
						title,
						href: `${href}/${condition.slug.toLowerCase()}`,
						linkTitle: `${persona.name} ${title}`,
						children: [],
					};
				}),
			};
		});

	const menuEntries: SitePlanEntry[] = [
		entry("Accueil", "/"),
		...lockedMenu.map((item) =>
			item.submenu
				? { title: item.title, children: personaEntries() }
				: entry(item.title, item.href),
		),
		...menu.map((item) =>
			"children" in item
				? {
						title: item.title,
						children: item.children.map((child) =>
							entry(child.title, child.href, child.external),
						),
					}
				: entry(item.title, item.href, item.external),
		),
	];

	const internalHrefs = (item: SitePlanEntry): string[] => [
		...(item.href && !item.external ? [normalizePath(item.href)] : []),
		...item.children.flatMap(internalHrefs),
	];

	const submenus = menuEntries.filter((group) => !group.href);
	const submenuOf = (href: string) => {
		const prefix = `${normalizePath(href)}/`;
		return submenus.find((group) =>
			internalHrefs(group).some((path) => path.startsWith(prefix)),
		);
	};
	const sameTitle = (a: string, b: string) =>
		a.trim().toLowerCase() === b.trim().toLowerCase();

	const sectionEntries = sections.flatMap(({ section, links }) => {
		const href = sectionPath(section.slug);
		if (isListed(href)) return [];
		const submenu = submenuOf(href);
		if (!submenu) return [entry(section.title, href)];
		const remaining = links.filter((link) => !isListed(link.href));
		// La page de la rubrique devient le titre du sous-menu qui porte son nom,
		// sinon un lien du sous-menu.
		listed.add(normalizePath(href));
		if (!submenu.href && sameTitle(submenu.title, section.title)) {
			submenu.href = href;
		} else {
			submenu.children.push({ title: section.title, href, children: [] });
		}
		submenu.children.push(
			...remaining.map((link) => entry(link.title, link.href)),
		);
		return [];
	});

	const otherPages = [...FIXED_PAGES, ...rootPages]
		.filter((link) => !isListed(link.href))
		.map((link) => entry(link.title, link.href));

	return [
		...menuEntries,
		...sectionEntries,
		...(otherPages.length
			? [{ title: "Autres pages", children: otherPages }]
			: []),
	];
};
