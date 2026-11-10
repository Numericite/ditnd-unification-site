const GRAVITY_FORMS_MOCK_URL = "http://127.0.0.1:4011";

const lastGravityFormsEntry = () =>
	cy.request(`${GRAVITY_FORMS_MOCK_URL}/__last-entry`).its("body");

describe("Contact particuliers form", () => {
	beforeEach(() => {
		cy.visit("/contact-particuliers");
	});

	function fillRequired() {
		cy.get('input[name="lastName"]').type("Dupont");
		cy.get('input[name="firstName"]').type("Marie");
		cy.get('input[name="email"]').type("marie.dupont@example.com");
		cy.get('select[name="objet"]').select("Diagnostic");
		cy.get('select[name="classification"]').select("Usager concerné");
		cy.get('textarea[name="message"]').type(
			"Message de test envoyé depuis Cypress pour vérifier le formulaire particuliers.",
		);
		cy.contains("label", "En soumettant ce formulaire").click();
	}

	it("displays the form", () => {
		cy.get('form input[name="lastName"]').should("be.visible");
		cy.get('form input[name="firstName"]').should("be.visible");
		cy.get('form button[type="submit"]')
			.contains("Envoyer")
			.should("be.visible");
	});

	it("shows validation errors when submitting empty", () => {
		cy.get('form button[type="submit"]').click();
		cy.contains("Veuillez renseigner votre nom.").should("be.visible");
		cy.contains("Veuillez renseigner votre prénom.").should("be.visible");
		cy.contains("Veuillez renseigner votre courriel.").should("be.visible");
		cy.contains("Vous devez accepter pour soumettre le formulaire.").should(
			"be.visible",
		);
	});

	it("submits successfully with only required fields", () => {
		cy.intercept("POST", "/api/trpc/contact.submitParticuliers*").as("submit");

		fillRequired();
		cy.get('form button[type="submit"]').click();

		cy.wait("@submit").its("response.statusCode").should("eq", 200);
		cy.contains("Votre message a bien été envoyé").should("be.visible");

		lastGravityFormsEntry().then((entry) => {
			expect(entry).to.include({
				form_id: 2,
				"28": "Dupont",
				"29": "Marie",
				"3": "marie.dupont@example.com",
				"15": "Diagnostic",
				"16": "Usager concerné",
				"24.1": "1",
			});
			expect(entry).not.to.have.any.keys("1", "6", "17", "18", "23.1");

			cy.request(`${GRAVITY_FORMS_MOCK_URL}/__last-notified-entry`)
				.its("body.entryId")
				.should("eq", entry.id);
		});
	});

	it("submits successfully with all optional fields filled too", () => {
		cy.intercept("POST", "/api/trpc/contact.submitParticuliers*").as("submit");

		cy.get('input[name="civility"][value="Madame"]').check({ force: true });
		cy.get('select[name="departement"]').select("05 - Hautes-Alpes");
		cy.get('select[name="sexe"]').select("Féminin");
		cy.get('select[name="ageRange"]').select("De 26 à 50 ans");
		fillRequired();
		cy.get('select[name="classification"]').select(
			"Parent d’un enfant concerné",
		);
		cy.get('form button[type="submit"]').click();

		cy.wait("@submit").its("response.statusCode").should("eq", 200);
		cy.contains("Votre message a bien été envoyé").should("be.visible");

		lastGravityFormsEntry().then((entry) => {
			expect(entry).to.include({
				"1": "Madame",
				"6": "05 - Hautes-alpes",
				"16": "Parent d'un enfant",
				"17": "Féminin",
				"18": "De 26 à 50 ans",
			});
		});
	});

	it("keeps the honeypot field hidden from sighted/AT users", () => {
		cy.get('input[name="website"]').should("exist").and("not.be.visible");
		cy.get('input[name="website"]')
			.parent()
			.should("have.attr", "aria-hidden", "true");
		cy.get('input[name="website"]').should("have.attr", "tabindex", "-1");
	});

	it("silently accepts but drops submissions when the honeypot is filled", () => {
		cy.intercept("POST", "/api/trpc/contact.submitParticuliers*").as("submit");

		fillRequired();
		cy.get('input[name="website"]').type("https://spam.example.com", {
			force: true,
		});
		cy.get('form button[type="submit"]').click();

		cy.wait("@submit").its("response.statusCode").should("eq", 200);
		cy.contains("Votre message a bien été envoyé").should("be.visible");
	});
});
