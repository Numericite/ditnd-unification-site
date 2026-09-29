import { accordion, block, paragraph, richText } from "../support/lexical";
import { watchAdminFormState } from "../support/payload";

const innermostEditors = () =>
	cy
		.get("[data-lexical-editor='true']")
		.filter((_, element) => !element.querySelector("[data-lexical-editor]"));

const saveAndWait = (url: string) => {
	cy.intercept({ url, method: /PATCH|POST/ }).as("save");
	cy.get("#action-save").should("not.be.disabled").click();
	cy.wait("@save").its("response.statusCode").should("eq", 200);
};

describe("Admin — rich text editor", () => {
	beforeEach(() => {
		cy.loginAsAdmin();
	});

	it("keeps accordion content typed before switching tabs", () => {
		const addedLine = "Ligne ajoutée avant de changer d'onglet.";
		cy.request("POST", "/api/globals/about?depth=0", {
			maisonDeLAutisme: {
				content: richText(
					paragraph("Présentation de la maison."),
					accordion("single", [
						{
							title: "Accordéon persistant",
							children: [paragraph("Ligne initiale.")],
						},
					]),
				),
			},
		});

		const formState = watchAdminFormState();
		cy.visitAdmin("/globals/about");
		innermostEditors()
			.contains("p", "Ligne initiale.")
			.click()
			.type(`{end}{enter}${addedLine}`);
		formState.shouldInclude(`"text":"${addedLine}"`);

		cy.contains(".tabs-field__tab-button", "GNCRA").click();
		cy.contains(".tabs-field__tab-button", "Maison de l'autisme").click();
		innermostEditors().should("contain.text", addedLine);

		saveAndWait("/api/globals/about*");
		cy.request("/api/globals/about?depth=0")
			.its("body.maisonDeLAutisme.content")
			.then((content) => {
				expect(JSON.stringify(content)).to.contain(addedLine);
			});

		cy.visit("/a-propos/maison-de-l-autisme");
		cy.contains(".fr-accordion__btn", "Accordéon persistant")
			.should("have.attr", "data-fr-js-collapse-button", "true")
			.click();
		cy.contains(".fr-accordion", addedLine).should("be.visible");
	});

	it("publishes the heading level and icon picked in a callout", () => {
		cy.createPracticalGuide({
			content: richText(
				paragraph("Introduction."),
				block("callout", {
					title: "Point de vigilance",
					titleAs: "h3",
					content: richText(paragraph("Contenu de la mise en avant.")),
				}),
			),
		}).then((guide) => {
			cy.waitForSimplification(guide.id);
			const formState = watchAdminFormState();
			cy.visitAdmin(`/collections/practical-guides/${guide.id}`);

			cy.get("#field-titleAs .rs__control").click();
			cy.contains(".rs__option", "Titre 2 (h2)").click();
			formState.shouldInclude('"titleAs":"h2"');
			cy.get("input#field-iconId").type("seedling");
			cy.contains('[role="option"]', "fr-icon-seedling-line").click();
			formState.shouldInclude('"iconId":"fr-icon-seedling-line"');

			saveAndWait(`/api/practical-guides/${guide.id}*`);
			cy.waitForSimplification(guide.id);
			cy.reload();
			cy.get("#field-titleAs .rs__single-value").should(
				"have.text",
				"Titre 2 (h2)",
			);
			cy.get("input#field-iconId").should(
				"have.attr",
				"placeholder",
				"fr-icon-seedling-line",
			);

			cy.visit(`/fiches-pratiques/${guide.slug}`);
			cy.get(".fr-callout#point-de-vigilance")
				.should("have.class", "fr-icon-seedling-line")
				.find("h2")
				.should("have.text", "Point de vigilance");
			cy.contains("#summary a", "Point de vigilance").should(
				"have.attr",
				"href",
				"#point-de-vigilance",
			);
		});
	});

	it("nests a list item with the Tab key", () => {
		cy.createPracticalGuide({
			content: richText(paragraph("Liste à construire :")),
		}).then((guide) => {
			cy.waitForSimplification(guide.id);
			const formState = watchAdminFormState();
			cy.visitAdmin(`/collections/practical-guides/${guide.id}`);
			cy.get(".toolbar-popup__button-indentIncrease").should("be.visible");

			innermostEditors()
				.contains("p", "Liste à construire :")
				.click()
				.type("{end}{enter}- Niveau un{enter}");
			cy.press(Cypress.Keyboard.Keys.TAB);
			innermostEditors().type("Niveau deux");
			formState.shouldInclude('"text":"Niveau deux"');

			saveAndWait(`/api/practical-guides/${guide.id}*`);
			cy.visit(`/fiches-pratiques/${guide.slug}`);
			cy.contains(".payload-richtext ul li", "Niveau un");
			cy.contains(".payload-richtext ul ul li", "Niveau deux");
		});
	});

	it("inserts a block from the slash menu and renders it on the site", () => {
		cy.createPracticalGuide({
			content: richText(paragraph("Avant la citation.")),
		}).then((guide) => {
			cy.waitForSimplification(guide.id);
			const formState = watchAdminFormState();
			cy.visitAdmin(`/collections/practical-guides/${guide.id}`);

			innermostEditors()
				.contains("p", "Avant la citation.")
				.click()
				.type("{end}{enter}/citation");
			cy.contains("#slash-menu button, .slash-menu-popup button", "Citation")
				.should("be.visible")
				.click();
			cy.get("textarea#field-quote").type("Citation ajoutée depuis l'éditeur.");
			formState.shouldInclude('"quote":"Citation ajoutée depuis l\'éditeur."');
			cy.get("input#field-author").type("Autrice E2E");
			formState.shouldInclude('"author":"Autrice E2E"');

			saveAndWait(`/api/practical-guides/${guide.id}*`);
			cy.visit(`/fiches-pratiques/${guide.slug}`);
			cy.get(".fr-quote")
				.should("contain.text", "Citation ajoutée depuis l'éditeur.")
				.and("contain.text", "Autrice E2E");
		});
	});
});
