export {};

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
