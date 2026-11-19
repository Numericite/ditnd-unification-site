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

	it("lists the section pages on the section page", () => {
		cy.visit("/a-propos");
		cy.get("main h1").should("contain.text", "À propos");
		cy.get('main nav a[href="/a-propos/gncra"]').should("exist");
		cy.get('main nav a[href="/a-propos/glossaire"]').should("exist");
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

		const aboutSectionId = () =>
			cy
				.request("/api/page-sections?where[slug][equals]=a-propos&depth=0")
				.its("body.docs.0.id");

		it("refuses a slug already used by a static page of the section", () => {
			aboutSectionId().then((section) => {
				const create = (slug: string) =>
					cy.request({
						method: "POST",
						url: "/api/pages?depth=0",
						body: {
							title: uniqueTitle("Glossaire"),
							content: richText(paragraph("Contenu de la page.")),
							slug,
							section,
							_status: "published",
						},
						failOnStatusCode: false,
					});

				create("glossaire").its("status").should("eq", 400);
				create(uniqueTitle("glossaire").toLowerCase().replace(/\W+/g, "-"))
					.its("status")
					.should("eq", 201);
			});
		});

		it("refuses to rename the slug of a section serving coded pages", () => {
			aboutSectionId().then((section) => {
				const update = (body: object) =>
					cy.request({
						method: "PATCH",
						url: `/api/page-sections/${section}?depth=0`,
						body,
						failOnStatusCode: false,
					});

				update({ slug: "a-propos-renomme" }).its("status").should("eq", 400);
				// The slug follows the label until edited: a new label must not move it.
				update({ title: "À propos du site" }).its("status").should("eq", 400);
				update({ title: "À propos" }).its("status").should("eq", 200);
			});
		});

		it("refuses to delete a section that still has pages", () => {
			aboutSectionId().then((section) => {
				cy.request({
					method: "DELETE",
					url: `/api/page-sections/${section}`,
					failOnStatusCode: false,
				})
					.its("status")
					.should("eq", 400);
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
