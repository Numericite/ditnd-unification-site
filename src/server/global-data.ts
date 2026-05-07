import { getPayload } from "payload";
import payloadConfig from "~/payload/payload.config";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import type { TDH } from "~/state/store";
import type { Home } from "~/payload/payload-types";

export type GlobalData = {
	persons: PersonaTile[];
	professionals: PersonaTile[];
	conditions: TDH[];
	footerTitle: string;
	homeCMS: Home;
};

const TTL_MS = 60_000;
let cache: { data: GlobalData; expiresAt: number } | null = null;
let inflight: Promise<GlobalData> | null = null;

async function fetchGlobalData(): Promise<GlobalData> {
	const payload = await getPayload({ config: payloadConfig });

	const [personasResult, conditionsResult, footer, homeCMS] = await Promise.all(
		[
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
		],
	);

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
