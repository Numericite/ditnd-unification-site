import { paragraph, richText } from "../support/lexical";
import { uniqueTitle } from "../support/payload";

// Seeded by src/payload/seed/tasks/about.ts.
describe("About pages served from the pages collection", () => {
	it("serves a section page under /a-propos with its breadcrumb and no dates", () => {
		cy.visit("/a-propos/gncra");
		cy.waitForHydration();
		cy.get("h1").should("contain.text", "GNCRA");
		cy.get(".fr-breadcrumb")
			.contains("a", "À propos")
			.should("have.attr", "href", "/a-propos");
		cy.contains("Publié le").should("not.exist");
		cy.get('.fr-nav a[href="/a-propos/gncra"]').should(
			"have.attr",
			"aria-current",
			"page",
		);
	});

	it("does not serve a section page at the site root", () => {
		cy.request({ url: "/gncra", failOnStatusCode: false })
			.its("status")
			.should("eq", 404);
	});

	describe("as an admin", () => {
		beforeEach(() => {
			cy.loginAsAdmin();
		});

		it("refuses a slug already used by a static page of the section", () => {
			cy.request({
				method: "POST",
				url: "/api/pages?depth=0",
				body: {
					title: uniqueTitle("Glossaire"),
					content: richText(paragraph("Contenu de la page.")),
					slug: "glossaire",
					section: "a-propos",
					_status: "published",
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.eq(400);
				expect(JSON.stringify(response.body)).to.contain(
					"Adresse déjà utilisée par le site",
				);
			});
		});

		it("shows the publication date only when the option is checked", () => {
			const create = (showDates: boolean) =>
				cy
					.request("POST", "/api/pages?depth=0", {
						title: uniqueTitle(
							showDates ? "Page avec dates" : "Page sans dates",
						),
						content: richText(paragraph("Contenu de la page.")),
						showDates,
						_status: "published",
					})
					.its("body.doc.slug");

			create(true).then((slug) => {
				cy.visit(`/${slug}`);
				cy.contains("Publié le").should("be.visible");
			});
			create(false).then((slug) => {
				cy.visit(`/${slug}`);
				cy.get("h1").should("be.visible");
				cy.contains("Publié le").should("not.exist");
			});
		});
	});
});
