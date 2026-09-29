import { heading, paragraph, richText } from "../support/lexical";

const textsOf = (node: unknown): string[] => {
	if (!node || typeof node !== "object") return [];
	const { text, children, root } = node as {
		text?: unknown;
		children?: unknown[];
		root?: unknown;
	};
	if (typeof text === "string") return [text];
	if (root) return textsOf(root);
	return (children ?? []).flatMap(textsOf);
};

describe("Simplified version of a practical guide", () => {
	beforeEach(() => {
		cy.loginAsAdmin();
	});

	it("is generated on publish, offered on the site and can be hidden from the back office", () => {
		cy.createPracticalGuide({
			content: richText(
				heading("h2", "Les démarches"),
				paragraph("Version standard de la fiche, rédigée par les experts."),
			),
		}).then((guide) => {
			cy.waitForSimplification(guide.id).then((published) => {
				expect(published.simplifiedGenerationStatus, "generation status").to.eq(
					"ready",
				);
				const simplifiedText = textsOf(published.contentSimplified).find(
					(text) => text.length > 20,
				);
				expect(simplifiedText, "simplified text").to.be.a("string");

				cy.visit(`/fiches-pratiques/${guide.slug}`);
				cy.contains("label", "Version simplifiée").click();
				cy.get("main")
					.should("contain.text", simplifiedText)
					.and("not.contain.text", "rédigée par les experts");
				cy.getCookie("content-mode").should(
					"have.property",
					"value",
					"simplified",
				);

				cy.reload();
				cy.get("main").should("contain.text", simplifiedText);

				cy.visitAdmin(`/collections/practical-guides/${guide.id}`);
				cy.get("#field-hideSimplifiedVersion").check();
				cy.intercept("PATCH", `/api/practical-guides/${guide.id}*`).as("save");
				cy.get("#action-save").should("not.be.disabled").click();
				cy.wait("@save").its("response.statusCode").should("eq", 200);

				cy.visit(`/fiches-pratiques/${guide.slug}`);
				cy.get("main")
					.should("contain.text", "rédigée par les experts")
					.and("not.contain.text", simplifiedText);
				cy.contains("label", "Version simplifiée").should("not.exist");
			});
		});
	});
});
