// Menu seedé (src/payload/seed/tasks/menu.ts) : Annuaire et À propos, après
// le lien Accueil et les éléments fixes générés par MainNavigation.
describe("Main navigation", () => {
	beforeEach(() => {
		cy.viewport(1440, 900);
		cy.visit("/a-propos/cra");
		cy.waitForHydration();
	});

	it("shows the home link and the locked items first, then the menu items", () => {
		cy.get("#menu .fr-nav__list > .fr-nav__item").then((items) => {
			const labels = [...items].map((item) =>
				item.querySelector(".fr-nav__btn, .fr-nav__link")?.textContent?.trim(),
			);
			expect(labels).to.deep.equal([
				"Accueil",
				"Je suis",
				"Fiches pratiques",
				"Formations",
				"Annuaire",
				"À propos",
			]);
		});
	});

	it("shows the home link as an icon with an accessible name", () => {
		cy.get("#menu .fr-nav__item").first().find("a").as("home");
		cy.get("@home").should("have.attr", "href", "/");
		cy.get("@home").should("not.have.attr", "aria-current");
		cy.get("@home")
			.find(".ri-home-line")
			.should("have.attr", "aria-hidden", "true");
		// Masqué visuellement, mais lu par les lecteurs d'écran.
		cy.get("@home")
			.contains("Accueil")
			.should("have.css", "position", "absolute");

		cy.get("@home").click();
		cy.location("pathname").should("eq", "/");
		cy.get("#menu .fr-nav__item")
			.first()
			.find("a")
			.should("have.attr", "aria-current", "page")
			.find(".ri-home-line");
	});

	it("shows the home label next to the icon in the mobile menu", () => {
		cy.viewport(375, 812);
		cy.get(".fr-header__navbar .fr-btn--menu").click();
		cy.get(".fr-header__menu .fr-nav__item")
			.first()
			.find("a")
			.contains("Accueil")
			.should("be.visible");
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
