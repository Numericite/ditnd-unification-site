describe("Contact pros CRA form", () => {
	beforeEach(() => {
		cy.visit("/contact-pros-cra");
	});

	it("displays the form", () => {
		cy.get('form input[name="firstName"]').should("be.visible");
		cy.get('form button[type="submit"]')
			.contains("Envoyer")
			.should("be.visible");
	});

	it("shows validation errors when submitting empty", () => {
		cy.get('form button[type="submit"]').click();
		cy.contains("Veuillez renseigner votre prénom.").should("be.visible");
		cy.contains("Veuillez renseigner votre nom de famille.").should(
			"be.visible",
		);
		cy.contains("Veuillez renseigner votre email professionnel.").should(
			"be.visible",
		);
	});

	it("submits a valid message successfully", () => {
		cy.intercept("POST", "/api/trpc/contact.submitProsCra*").as("submit");

		cy.get('input[name="firstName"]').type("Jean");
		cy.get('input[name="lastName"]').type("Dupont");
		cy.get('input[name="craName"]').type("CRA Test");
		cy.get('input[name="craRole"]').type("Coordinateur");
		cy.get('select[name="wish"]').select("propose-content");
		cy.get('textarea[name="message"]').type(
			"Message de test envoyé depuis Cypress pour vérifier le formulaire.",
		);
		cy.get('input[name="email"]').type("jean.dupont@example.com");

		cy.get('form button[type="submit"]').click();

		cy.wait("@submit").its("response.statusCode").should("eq", 200);
		cy.contains("Votre message a bien été envoyé").should("be.visible");
	});

	it("keeps the honeypot field hidden from sighted/AT users", () => {
		cy.get('input[name="website"]').should("exist").and("not.be.visible");
		cy.get('input[name="website"]')
			.parent()
			.should("have.attr", "aria-hidden", "true");
		cy.get('input[name="website"]').should("have.attr", "tabindex", "-1");
	});

	it("silently accepts but drops submissions when the honeypot is filled", () => {
		cy.intercept("POST", "/api/trpc/contact.submitProsCra*").as("submit");

		cy.get('input[name="firstName"]').type("Bot");
		cy.get('input[name="lastName"]').type("Filler");
		cy.get('input[name="craName"]').type("CRA Bot");
		cy.get('input[name="craRole"]').type("Bot");
		cy.get('select[name="wish"]').select("propose-content");
		cy.get('textarea[name="message"]').type(
			"Message envoyé par un bot pour tester le honeypot.",
		);
		cy.get('input[name="email"]').type("bot@example.com");
		cy.get('input[name="website"]').type("https://spam.example.com", {
			force: true,
		});

		cy.get('form button[type="submit"]').click();

		cy.wait("@submit").its("response.statusCode").should("eq", 200);
		cy.contains("Votre message a bien été envoyé").should("be.visible");
	});
});
