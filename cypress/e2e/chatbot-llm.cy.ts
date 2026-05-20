// Opt-in test that calls the real Albert API through the chatbot.
// Gated by Cypress.env("LLM_TESTS_ENABLED") so the suite stays green in
// PRs that don't have access to ALBERT_API_KEY/URL secrets (e.g. forks).
// Enable locally with `CYPRESS_LLM_TESTS_ENABLED=true yarn cypress:run`.

describe("Chatbot — real Albert LLM (opt-in)", () => {
	before(function () {
		if (!Cypress.env("LLM_TESTS_ENABLED")) this.skip();
	});

	it("returns a non-empty answer for a real question", () => {
		cy.visit("/");
		cy.contains("button", "Posez votre question").click();
		cy.get('[role="dialog"][aria-labelledby="chatbot-title"]').should(
			"be.visible",
		);

		cy.get('[role="dialog"] textarea').type(
			"Qu'est-ce qu'un trouble du neurodéveloppement ?",
		);
		cy.get('[role="dialog"] button').contains("Envoyer").click();

		// LLM round-trip: query expansion + embedding + rerank + completion.
		// Give it 60s to be safe.
		cy.contains("En résumé", { timeout: 60_000 }).should("be.visible");

		// At least the assistant's content paragraph should be present and non-empty.
		cy.contains("En résumé")
			.parent()
			.find("p")
			.invoke("text")
			.should("have.length.greaterThan", 10);

		// The "Poser une autre question" button should be available.
		cy.contains("button", "Poser une autre question").should("be.visible");
	});
});
