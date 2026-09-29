export {};

declare global {
	namespace Cypress {
		interface Chainable {
			waitForHydration(): Chainable<void>;
		}
	}
}

const CONSENT_STORAGE_KEY =
	"@codegouvfr/react-dsfr finalityConsent youtube-cartographie-matomo";

Cypress.Commands.overwrite(
	"visit",
	(originalFn, url: string, options: Partial<Cypress.VisitOptions> = {}) => {
		const visit = originalFn as unknown as (
			url: string,
			options: Partial<Cypress.VisitOptions>,
		) => Cypress.Chainable;

		return visit(url, {
			...options,
			onBeforeLoad(win) {
				win.localStorage.setItem(
					CONSENT_STORAGE_KEY,
					JSON.stringify({
						youtube: true,
						cartographie: true,
						matomo: true,
						isFullConsent: true,
					}),
				);
				options.onBeforeLoad?.(win);
			},
		});
	},
);

// Set by an effect of the main navigation: once it is there, React has
// hydrated the page and already reported any hydration mismatch.
Cypress.Commands.add("waitForHydration", () => {
	cy.document({ log: false }).should((doc) => {
		expect(
			doc.documentElement.style.getPropertyValue("--sticky-header-height"),
			"page hydrated",
		).not.to.equal("");
	});
});
