// Contenu seedé (src/payload/seed/tasks/footer.ts, onglet « Données personnelles »).
describe("Personal data page", () => {
	it("renders the CMS content and the cookie preferences button", () => {
		cy.visit("/");
		cy.contains("#footer a", "Données personnelles").click();
		cy.location("pathname").should("eq", "/donnees-personnelles");
		cy.get("main h1").should("have.text", "Données personnelles et cookies");
		cy.contains("h2", "Mesure d'audience (Matomo)").should("be.visible");
		cy.contains("button", "Gérer mes préférences de cookies")
			.should("have.attr", "aria-controls", "fr-consent-modal")
			.click();
		cy.get("#fr-consent-modal").should("be.visible");
	});

	it("redirects the former URL", () => {
		cy.visit("/gestion-des-cookies");
		cy.location("pathname").should("eq", "/donnees-personnelles");
	});
});
