import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LOCKED_MENU_ITEMS } from "./menu";
import {
	type SitePlanEntry,
	type SitePlanInput,
	buildSitePlan,
} from "./sitePlan";

const input: SitePlanInput = {
	lockedMenu: LOCKED_MENU_ITEMS,
	menu: [
		{
			title: "Annuaire",
			href: "https://annuaire.autismeinfoservice.fr/",
			external: true,
		},
		{
			title: "À propos",
			children: [
				{ title: "CRA", href: "/a-propos/cra", external: false },
				{ title: "Glossaire", href: "/glossaire", external: false },
			],
		},
		{ title: "Nous contacter", href: "/contact", external: false },
	],
	personas: [{ slug: "parent", name: "Je suis parent" }],
	conditions: [{ slug: "TSA", name: "Autisme", acronym: "TSA" }],
	sections: [
		{
			section: { slug: "a-propos", title: "À propos" },
			links: [
				{ title: "CRA", href: "/a-propos/cra" },
				{ title: "GNCRA", href: "/a-propos/gncra" },
			],
		},
		{
			section: { slug: "contact", title: "Contact" },
			links: [{ title: "Particuliers", href: "/contact/particuliers" }],
		},
		{
			section: { slug: "aides", title: "Aides" },
			links: [{ title: "AEEH", href: "/aides/aeeh" }],
		},
	],
	rootPages: [
		{ title: "Charte", href: "/charte" },
		{ title: "Contact particuliers", href: "/contact/particuliers" },
	],
};

const titles = (entries: SitePlanEntry[]) => entries.map((e) => e.title);
const find = (entries: SitePlanEntry[], title: string) => {
	const found = entries.find((e) => e.title === title);
	assert.ok(found, `${title} absent du plan`);
	return found;
};

describe("buildSitePlan", () => {
	const plan = buildSitePlan(input);

	it("reprend les éléments du menu dans le même ordre", () => {
		assert.deepEqual(titles(plan).slice(0, 7), [
			"Accueil",
			"Je suis",
			"Fiches pratiques",
			"Formations",
			"Annuaire",
			"À propos",
			"Nous contacter",
		]);
	});

	it("détaille les parcours par trouble", () => {
		const [persona] = find(plan, "Je suis").children;
		assert.equal(persona?.href, "/parcours/parent");
		assert.deepEqual(persona?.children[0], {
			title: "par le TSA",
			href: "/parcours/parent/tsa",
			children: [],
		});
	});

	it("liste les pages d'une rubrique sous le lien du menu qui y mène", () => {
		assert.deepEqual(find(plan, "Nous contacter").children, [
			{
				title: "Particuliers",
				href: "/contact/particuliers",
				children: [],
			},
		]);
	});

	it("ajoute les rubriques absentes du menu, sans les pages déjà listées", () => {
		assert.deepEqual(titles(plan).slice(7), [
			"À propos",
			"Aides",
			"Autres pages",
		]);
		assert.deepEqual(titles(plan[7]?.children ?? []), ["GNCRA"]);
		assert.equal(plan[7]?.href, "/a-propos");
	});

	it("regroupe les pages restantes sans doublon", () => {
		assert.deepEqual(titles(find(plan, "Autres pages").children), ["Charte"]);
	});

	it("omet les rubriques entièrement couvertes par le menu", () => {
		const plan = buildSitePlan({
			...input,
			sections: [
				{
					section: { slug: "a-propos", title: "À propos" },
					links: [{ title: "CRA", href: "/a-propos/cra" }],
				},
			],
		});
		assert.equal(plan.filter((e) => e.title === "À propos").length, 1);
	});

	it("range un élément fixe masqué dans les autres pages", () => {
		const plan = buildSitePlan({
			...input,
			lockedMenu: LOCKED_MENU_ITEMS.filter((item) => item.key !== "courses"),
		});
		assert.ok(!titles(plan).slice(0, 4).includes("Formations"));
		assert.ok(
			titles(find(plan, "Autres pages").children).includes("Formations"),
		);
	});
});
