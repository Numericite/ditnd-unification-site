import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import type { TDH } from "~/state/store";
import type { Home } from "~/payload/payload-types";
import { REFERENCE_COLLECTIONS } from "~/utils/links";
import {
	LOCKED_MENU_ITEMS,
	type LockedMenuItem,
	type NavItem,
	resolveLockedItems,
	resolveMenu,
} from "~/utils/menu";

export type GlobalData = {
	persons: PersonaTile[];
	professionals: PersonaTile[];
	conditions: TDH[];
	footerTitle: string;
	homeCMS: Home;
	menu: NavItem[];
	lockedMenu: LockedMenuItem[];
};

const TTL_MS = 60_000;

// Seuls le slug, le statut et la rubrique (pages) servent à construire l'URL
// d'un lien du menu.
const menuLinkPopulate = Object.fromEntries(
	REFERENCE_COLLECTIONS.map((collection) => [
		collection,
		collection === "pages"
			? { slug: true, _status: true, section: true }
			: { slug: true, _status: true },
	]),
);
let cache: { data: GlobalData; expiresAt: number } | null = null;
let inflight: Promise<GlobalData> | null = null;

async function fetchGlobalData(): Promise<GlobalData> {
	const payload = await getPayload({ config: payloadConfig });

	const [personasResult, conditionsResult, footer, homeCMS, menu] =
		await Promise.all([
			payload.find({
				collection: "personas",
				limit: 0,
				select: { updatedAt: false, createdAt: false },
			}),
			payload.find({
				collection: "conditions",
				limit: 0,
				select: { updatedAt: false, createdAt: false },
			}),
			payload.findGlobal({ slug: "footer" }),
			payload.findGlobal({ slug: "home" }),
			payload
				.findGlobal({ slug: "menu", depth: 1, populate: menuLinkPopulate })
				.then((menu) => ({
					items: resolveMenu(menu),
					locked: resolveLockedItems(menu),
				}))
				.catch((err) => {
					console.error("[global-data] menu failed:", err);
					return { items: [] as NavItem[], locked: LOCKED_MENU_ITEMS };
				}),
		]);

	const persons: PersonaTile[] = personasResult.docs.map((persona) => ({
		...persona,
		display: "person",
	}));

	const professionals: PersonaTile[] = personasResult.docs
		.filter((persona) => persona.slug.startsWith("pro"))
		.map((persona) => ({ ...persona, display: "afterProfessional" }));

	const conditions: TDH[] = conditionsResult.docs.map((condition) => ({
		...condition,
		display: "condition",
	}));

	return {
		persons,
		professionals,
		conditions,
		footerTitle: footer.title,
		homeCMS: homeCMS as Home,
		menu: menu.items,
		lockedMenu: menu.locked,
	};
}

export async function getGlobalData(): Promise<GlobalData> {
	if (cache && cache.expiresAt > Date.now()) return cache.data;
	if (inflight) return inflight;

	inflight = fetchGlobalData()
		.then((data) => {
			cache = { data, expiresAt: Date.now() + TTL_MS };
			return data;
		})
		.finally(() => {
			inflight = null;
		});

	return inflight;
}
