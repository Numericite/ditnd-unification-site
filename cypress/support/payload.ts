import { paragraph, richText } from "./lexical";

export type PracticalGuide = {
	id: number;
	title: string;
	slug: string;
	_status: "draft" | "published";
	content: unknown;
	contentSimplified?: unknown;
	simplifiedGenerationStatus?: "pending" | "ready" | "failed" | null;
};

// Seeded by src/payload/seed/index.ts.
const ADMIN = { email: "admin@test.test", password: "12345" };

declare global {
	namespace Cypress {
		interface Chainable {
			loginAsAdmin(): Chainable<void>;
			createPracticalGuide(
				data?: Record<string, unknown>,
			): Chainable<PracticalGuide>;
			getPracticalGuide(id: number): Chainable<PracticalGuide>;
			waitForSimplification(id: number): Chainable<PracticalGuide>;
			visitAdmin(path: string): Chainable<void>;
		}
	}
}

export const uniqueTitle = (label: string) =>
	`${label} E2E ${Date.now().toString(36)}`;

Cypress.Commands.add("loginAsAdmin", () => {
	cy.session(
		"admin",
		() => {
			cy.request("POST", "/api/users/login", ADMIN);
		},
		{
			cacheAcrossSpecs: true,
			validate: () => {
				cy.request("/api/users/me").its("body.user.role").should("eq", "admin");
			},
		},
	);
	cy.setCookie("payload-lng", "fr");
});

Cypress.Commands.add("createPracticalGuide", (data = {}) => {
	const title = (data.title as string | undefined) ?? uniqueTitle("Fiche");
	const status = (data._status as string | undefined) ?? "published";
	return cy
		.request(
			"POST",
			`/api/practical-guides?depth=0${status === "draft" ? "&draft=true" : ""}`,
			{
				description: "Fiche créée par les tests E2E.",
				persona: [1],
				themes: [1],
				content: richText(paragraph("Contenu de départ.")),
				...data,
				title,
				_status: status,
			},
		)
		.its("body.doc");
});

Cypress.Commands.add("getPracticalGuide", (id) =>
	cy.request(`/api/practical-guides/${id}?depth=0`).its("body"),
);

// Publishing a guide starts the Albert simplification in the background
// (PracticalGuides afterChange hook), which writes the document again twice.
Cypress.Commands.add("waitForSimplification", (id) => {
	const poll = (attempt: number): Cypress.Chainable<PracticalGuide> =>
		cy.getPracticalGuide(id).then((guide) => {
			if (
				guide.simplifiedGenerationStatus === "ready" ||
				guide.simplifiedGenerationStatus === "failed"
			) {
				return cy.wrap(guide, { log: false });
			}
			if (attempt >= 50) {
				throw new Error(
					`Simplification of guide ${id} still "${guide.simplifiedGenerationStatus}"`,
				);
			}
			return cy.wait(200, { log: false }).then(() => poll(attempt + 1));
		});
	return poll(0);
});

// Admin edits reach the document form asynchronously (idle callback, plus a
// server round trip for block fields). Once a "form-state" post of the
// document carries the edit, saving or switching tabs is safe. Posts made by
// a block embed the parent document too, under "documentFormState".
export const watchAdminFormState = () => {
	const bodies: string[] = [];
	cy.intercept({ method: "POST", pathname: /^\/admin\// }, (req) => {
		if (
			typeof req.body === "string" &&
			req.body.includes('"name":"form-state"') &&
			!req.body.includes('"documentFormState"')
		) {
			bodies.push(req.body);
		}
	});
	return {
		shouldInclude: (fragment: string) =>
			cy.wrap(bodies, { log: false }).should((posted) => {
				expect(
					posted.some((body) => body.includes(fragment)),
					`admin form state includes ${fragment}`,
				).to.equal(true);
			}),
	};
};

// Document views flag their form once it is mounted client side; clicking
// earlier hits a page that is not interactive yet.
Cypress.Commands.add("visitAdmin", (path) => {
	cy.viewport(1440, 900);
	cy.visit(`/admin${path}`);
	const isListView = /^\/collections\/[^/?]+(\?|$)/.test(path);
	cy.get(
		isListView ? ".collection-list" : 'form[data-form-ready="true"]',
	).should("exist");
});
