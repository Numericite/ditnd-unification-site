describe("Site plan", () => {
	beforeEach(() => {
		cy.viewport(1440, 900);
		cy.visit("/plan-du-site");
		cy.waitForHydration();
	});

	it("follows the main navigation order", () => {
		cy.get("#menu .fr-nav__list > .fr-nav__item").then((items) => {
			const navLabels = [...items].map((item) =>
				item.querySelector(".fr-nav__btn, .fr-nav__link")?.textContent?.trim(),
			);
			cy.get("nav[aria-label='Plan du site'] h2").then((headings) => {
				const planLabels = [...headings]
					.slice(0, navLabels.length)
					.map((heading) => heading.textContent?.trim());
				expect(planLabels).to.deep.equal(navLabels);
			});
		});
	});

	it("lists each internal page once", () => {
		cy.get("nav[aria-label='Plan du site'] a[href^='/']").then((links) => {
			const hrefs = [...links].map((link) => link.getAttribute("href"));
			expect(hrefs).to.deep.equal([...new Set(hrefs)]);
		});
	});

	it("opens external links in a new tab", () => {
		cy.contains("nav[aria-label='Plan du site'] a", "Annuaire")
			.should("have.attr", "target", "_blank")
			.and("have.attr", "title", "Annuaire, nouvelle fenêtre");
	});
});
