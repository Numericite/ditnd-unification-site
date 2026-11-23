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
			linkTitle: "Je suis parent par le TSA",
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

	it("rattache les pages oubliées au sous-menu de leur rubrique", () => {
		assert.deepEqual(titles(find(plan, "À propos").children), [
			"CRA",
			"Glossaire",
			"GNCRA",
		]);
		assert.equal(plan.filter((e) => e.title === "À propos").length, 1);
	});

	it("lie la page de la rubrique au sous-menu qui porte son nom", () => {
		assert.equal(find(plan, "À propos").href, "/a-propos");
	});

	it("ajoute la page de la rubrique au sous-menu qui ne porte pas son nom", () => {
		const plan = buildSitePlan({
			...input,
			menu: [
				{
					title: "Qui sommes-nous",
					children: [{ title: "CRA", href: "/a-propos/cra", external: false }],
				},
			],
		});
		const submenu = find(plan, "Qui sommes-nous");
		assert.equal(submenu.href, undefined);
		assert.deepEqual(
			submenu.children.map((e) => e.href),
			["/a-propos/cra", "/a-propos", "/a-propos/gncra"],
		);
	});

	it("ne reprend pas sous une rubrique une page liée plus loin dans le menu", () => {
		const plan = buildSitePlan({
			...input,
			menu: [
				{ title: "Nous contacter", href: "/contact", external: false },
				{
					title: "Aide",
					children: [
						{
							title: "Particuliers",
							href: "/contact/particuliers",
							external: false,
						},
					],
				},
			],
		});
		assert.deepEqual(find(plan, "Nous contacter").children, []);
		assert.deepEqual(titles(find(plan, "Aide").children), ["Particuliers"]);
	});

	it("ajoute les rubriques absentes du menu", () => {
		assert.deepEqual(titles(plan).slice(7), ["Aides", "Autres pages"]);
		assert.equal(find(plan, "Aides").href, "/aides");
	});

	it("ne range pas de pages sous un lien de premier niveau", () => {
		const plan = buildSitePlan({
			...input,
			menu: [{ title: "CRA", href: "/a-propos/cra", external: false }],
		});
		assert.deepEqual(find(plan, "CRA").children, []);
		assert.deepEqual(titles(find(plan, "À propos").children), ["GNCRA"]);
	});

	it("regroupe les pages restantes sans doublon", () => {
		assert.deepEqual(titles(find(plan, "Autres pages").children), ["Charte"]);
	});

	it("garde la page d'une rubrique entièrement couverte par le menu", () => {
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
		assert.equal(find(plan, "À propos").href, "/a-propos");
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
