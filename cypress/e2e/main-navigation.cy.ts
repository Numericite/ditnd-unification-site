// Menu seedé (src/payload/seed/tasks/menu.ts) : Annuaire et À propos, après
// les éléments fixes générés par MainNavigation.
describe("Main navigation", () => {
	beforeEach(() => {
		cy.viewport(1440, 900);
		cy.visit("/a-propos/cra");
		cy.waitForHydration();
	});

	it("shows the locked items first, then the menu items", () => {
		cy.get("#menu .fr-nav__list > .fr-nav__item").then((items) => {
			const labels = [...items].map((item) =>
				item.querySelector(".fr-nav__btn, .fr-nav__link")?.textContent?.trim(),
			);
			expect(labels).to.deep.equal([
				"Je suis",
				"Fiches pratiques",
				"Me former",
				"Annuaire",
				"À propos",
			]);
		});
	});

	it("opens external links in a new tab", () => {
		cy.contains("#menu a", "Annuaire")
			.should("have.attr", "href", "https://annuaire.autismeinfoservice.fr/")
			.and("have.attr", "target", "_blank")
			.and("have.attr", "rel", "noopener noreferrer")
			.and("have.attr", "title", "Annuaire, nouvelle fenêtre");
	});

	it("lists the submenu links and marks the current page", () => {
		cy.contains("#menu button", "À propos")
			.should("have.attr", "aria-current", "true")
			.click();
		cy.contains("#menu a", /^CRA$/)
			.should("be.visible")
			.and("have.attr", "href", "/a-propos/cra")
			.and("have.attr", "aria-current", "page");
	});
});
