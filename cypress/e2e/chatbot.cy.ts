describe("Chatbot — UI behaviour", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	function openChatbot() {
		cy.contains("button", "Posez votre question").click();
		cy.get('[role="dialog"][aria-labelledby="chatbot-title"]').should(
			"be.visible",
		);
	}

	it("opens and closes from the launcher button", () => {
		cy.get('[role="dialog"]').should("not.exist");
		openChatbot();
		// On desktop the launcher stays in the DOM and toggles to "Fermer l'assistant".
		cy.contains("button", "Fermer l'assistant").click();
		cy.get('[role="dialog"]').should("not.exist");
	});

	it("closes when pressing Escape", () => {
		openChatbot();
		cy.get("body").type("{esc}");
		cy.get('[role="dialog"]').should("not.exist");
	});

	it("closes when clicking the close button inside the dialog", () => {
		openChatbot();
		cy.get('[role="dialog"]')
			.find('button[title="Fermer l\'assistant conversationnel"]')
			.click();
		cy.get('[role="dialog"]').should("not.exist");
	});

	it("disables the send button when the input is empty", () => {
		openChatbot();
		cy.get('[role="dialog"] button').contains("Envoyer").should("be.disabled");
		cy.get('[role="dialog"] textarea').type("Hello");
		cy.get('[role="dialog"] button')
			.contains("Envoyer")
			.should("not.be.disabled");
	});

	it("rejects messages longer than 800 chars client-side without calling the API", () => {
		cy.intercept("POST", "**/api/trpc/ai.chatbotDirectSend*").as("send");
		openChatbot();

		cy.get('[role="dialog"] textarea').type("a".repeat(801), { delay: 0 });
		cy.get('[role="dialog"] button').contains("Envoyer").click();

		cy.contains("Votre question est un peu longue pour moi").should(
			"be.visible",
		);

		// No request should have been issued — give it a beat then assert.
		cy.wait(500);
		cy.get("@send.all").should("have.length", 0);
	});

	it("shows an error message when the chatbot API fails", () => {
		cy.intercept("POST", "**/api/trpc/ai.chatbotDirectSend*", {
			statusCode: 500,
			body: { error: { message: "boom" } },
		}).as("send");

		openChatbot();
		cy.get('[role="dialog"] textarea').type("Une question quelconque.");
		cy.get('[role="dialog"] button').contains("Envoyer").click();

		cy.wait("@send");
		cy.contains(
			"Une erreur est survenue lors de l'envoi de votre message",
		).should("be.visible");
	});
});
