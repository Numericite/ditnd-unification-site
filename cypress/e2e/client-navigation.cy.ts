const TRANSPARENT = "rgba(0, 0, 0, 0)";

const expectValidStyleClassNames = () =>
	cy.get('[class*="-$-"]').should("not.exist");

describe("Client-side navigation", () => {
	it("keeps the page styles after navigating to the home page", () => {
		cy.visit("/accessibilite");
		cy.waitForHydration();
		cy.window().then((win) => {
			(win as Window & { e2eNoReload?: boolean }).e2eNoReload = true;
		});

		cy.get('a[title="Accueil - Maison de l\'autisme"]').first().click();
		cy.location("pathname").should("eq", "/");
		cy.window().its("e2eNoReload").should("eq", true);

		cy.get('[class*="coloredContainer"]')
			.should("have.css", "background-color")
			.and("not.eq", TRANSPARENT);
		cy.get('[class*="headerImageContainer"]').should(
			"have.css",
			"display",
			"flex",
		);
		expectValidStyleClassNames();

		cy.contains("#menu a", "Fiches pratiques").click();
		cy.location("pathname").should("eq", "/fiches-pratiques");
		cy.window().its("e2eNoReload").should("eq", true);
		cy.get('[class*="borderRight"]').should(
			"have.css",
			"border-right-width",
			"2px",
		);
		expectValidStyleClassNames();
	});

	it("redirects legacy URLs", () => {
		cy.request({ url: "/a-propos/cras", followRedirect: false }).then(
			(response) => {
				expect(response.status).to.be.oneOf([301, 308]);
				expect(response.redirectedToUrl).to.match(/\/a-propos\/cra$/);
			},
		);
		cy.request({
			url: "/fiches-pratiques-autisme/une-ancienne-fiche?utm_source=lien",
			followRedirect: false,
		}).then((response) => {
			expect(response.status).to.eq(301);
			expect(response.redirectedToUrl).to.match(
				/\/fiches-pratiques\?utm_source=lien$/,
			);
		});
	});
});
