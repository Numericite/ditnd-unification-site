// Liens seedés (src/payload/seed/tasks/footer.ts) : les deux contacts, entre
// les liens fixes et le bouton des paramètres d'affichage.
describe("Footer", () => {
	it("shows the editable links between the locked ones", () => {
		cy.visit("/");
		cy.get("#footer .fr-footer__bottom-item").then((items) => {
			const labels = [...items].map((item) => item.textContent?.trim());
			expect(labels).to.deep.equal([
				"Plan du site",
				"Accessibilité : partiellement conforme",
				"Mentions légales",
				"Gestion des cookies",
				"Données personnelles",
				"Contact particuliers",
				"Contact professionnels",
				"Paramètres d'affichage",
			]);
		});
		cy.contains("#footer a", "Contact particuliers").should(
			"have.attr",
			"href",
			"/contact/particuliers",
		);
	});

	it("lists the locked links around the editable ones in the admin", () => {
		cy.loginAsAdmin();
		cy.visitAdmin("/globals/footer");
		cy.contains("button", "Liens du bas de page").click();
		cy.get('[title="Élément fixe : non modifiable"]')
			.should("have.length", 6)
			.first()
			.should("contain.text", "Plan du site");
		cy.get('[id^="bottomLinks-row-"]')
			.first()
			.find(".array-field__row-header")
			.should("have.text", "Contact particuliers");
	});
});
