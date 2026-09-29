import { block, paragraph, richText } from "../support/lexical";
import {
	type PracticalGuide,
	uniqueTitle,
	watchAdminFormState,
} from "../support/payload";

const editor = () =>
	cy.get(".rich-text-lexical [data-lexical-editor='true']").first();

const publishFromAdmin = (id: number) => {
	cy.intercept("PATCH", `/api/practical-guides/${id}*`).as("save");
	cy.get("#action-save").should("not.be.disabled").click();
	cy.wait("@save").its("response.statusCode").should("eq", 200);
};

const listStatus = (title: string) => {
	cy.visitAdmin(
		`/collections/practical-guides?search=${encodeURIComponent(title)}&columns=${encodeURIComponent('["title","_status"]')}`,
	);
	return cy
		.contains("tbody tr", title)
		.find(".cell-_status")
		.invoke("text")
		.invoke("trim");
};

const expectHiddenFromSite = (guide: PracticalGuide) => {
	cy.request({
		url: `/fiches-pratiques/${guide.slug}`,
		failOnStatusCode: false,
	})
		.its("status")
		.should("eq", 404);
	cy.visit(`/fiches-pratiques?search=${encodeURIComponent(guide.title)}`);
	cy.get("#results").should("not.contain", guide.title);
	cy.visit(`/recherche?search=${encodeURIComponent(guide.title)}`);
	cy.get("main").should("not.contain", guide.title);
	cy.request("/sitemap.xml").its("body").should("not.contain", guide.slug);
};

describe("Admin — practical guide publication", () => {
	beforeEach(() => {
		cy.loginAsAdmin();
	});

	it("publishes an edit made just before clicking publish, without waiting for autosave", () => {
		cy.createPracticalGuide({
			_status: "draft",
			content: richText(paragraph("Premier jet de la fiche.")),
		}).then((guide) => {
			expectHiddenFromSite(guide);

			const formState = watchAdminFormState();
			cy.intercept("PATCH", "/api/practical-guides/*autosave=true*").as(
				"autosave",
			);
			cy.visitAdmin(`/collections/practical-guides/${guide.id}`);
			editor()
				.contains("p", "Premier jet de la fiche.")
				.click()
				.type("{end} Ajout publié aussitôt.");
			formState.shouldInclude(
				"Premier jet de la fiche. Ajout publié aussitôt.",
			);
			cy.get("@autosave.all").should("have.length", 0);
			publishFromAdmin(guide.id);

			cy.waitForSimplification(guide.id)
				.its("content")
				.then((content) => {
					expect(JSON.stringify(content)).to.contain(
						"Premier jet de la fiche. Ajout publié aussitôt.",
					);
				});

			cy.reload();
			editor().should(
				"contain.text",
				"Premier jet de la fiche. Ajout publié aussitôt.",
			);

			cy.visit(`/fiches-pratiques/${guide.slug}`);
			cy.get("#contenu h1").should("have.text", guide.title);
			cy.get("main").should("contain.text", "Ajout publié aussitôt.");
		});
	});

	it("tracks the publication status in the list and hides an unpublished guide from the site", () => {
		const title = uniqueTitle("Fiche cycle de vie");

		cy.createPracticalGuide({
			title,
			content: richText(paragraph("Version en ligne.")),
		}).then((guide) => {
			cy.waitForSimplification(guide.id);
			listStatus(title).should("eq", "Publié");

			cy.visit(`/fiches-pratiques?search=${encodeURIComponent(title)}`);
			cy.get("#results").should("contain", title);
			cy.request("/sitemap.xml").its("body").should("contain", guide.slug);

			cy.request(
				"PATCH",
				`/api/practical-guides/${guide.id}?draft=true&depth=0`,
				{ content: richText(paragraph("Brouillon non publié.")) },
			);
			listStatus(title).should("eq", "Publié · modifications non publiées");
			cy.visit(`/fiches-pratiques/${guide.slug}`);
			cy.get("main")
				.should("contain.text", "Version en ligne.")
				.and("not.contain.text", "Brouillon non publié.");

			cy.visitAdmin(`/collections/practical-guides/${guide.id}`);
			cy.get(".doc-controls__dots").click();
			cy.get("#action-unpublish").click();
			cy.intercept("PATCH", `/api/practical-guides/${guide.id}*`).as(
				"unpublish",
			);
			cy.get(".confirmation-modal").contains("button", "Confirmer").click();
			cy.wait("@unpublish").its("response.statusCode").should("eq", 200);

			listStatus(title).should("eq", "Non publié");
			expectHiddenFromSite(guide);
		});
	});

	it("previews a draft for admins only", () => {
		cy.createPracticalGuide({
			_status: "draft",
			content: richText(
				paragraph("Contenu visible dans la prévisualisation."),
				block("youtube", {
					url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
					sizeUnit: "percent",
					sizeValue: 100,
				}),
			),
		}).then((guide) => {
			cy.visit(`/draft/${guide.slug}`);
			cy.title().should("include", "(brouillon)");
			cy.get("#contenu h1").should("have.text", guide.title);
			cy.get("main").should(
				"contain.text",
				"Contenu visible dans la prévisualisation.",
			);
			cy.contains("button", "Voir la vidéo YouTube").should("exist");

			cy.clearCookie("payload-token");
			cy.request({ url: `/draft/${guide.slug}`, failOnStatusCode: false })
				.its("status")
				.should("eq", 404);
		});
	});
});
