import type { BasePayload } from "payload";
import type { Menu } from "~/payload/payload-types";

const internal = (title: string, internalUrl: string) => ({
	title,
	link: { type: "internal" as const, internalUrl },
});

// Liens qui étaient codés en dur dans MainNavigation avant le global « menu ».
export const defaultMenuItems: NonNullable<Menu["items"]> = [
	{
		title: "Annuaire",
		kind: "link",
		link: {
			type: "external",
			externalUrl: "https://annuaire.autismeinfoservice.fr/",
		},
	},
	{
		title: "À propos",
		kind: "submenu",
		children: [
			internal("Maison de l'autisme", "/a-propos/maison-de-l-autisme"),
			internal("GNCRA", "/a-propos/gncra"),
			internal("CRA", "/a-propos/cra"),
			internal("Glossaire", "/a-propos/glossaire"),
		],
	},
];

export default async function menuTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "menu",
		data: { items: defaultMenuItems },
	});
}
