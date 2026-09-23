const PAGE = "/accessibilite";

const stickyHeaderHeight = (doc: Document) =>
	Number.parseFloat(
		getComputedStyle(doc.documentElement).getPropertyValue(
			"--sticky-header-height",
		),
	);

/**
 * The seeded CMS content is short enough that the page may not scroll at all,
 * so give it room instead of relying on a particular page being tall.
 */
const givePageRoomToScroll = () =>
	cy.document().then((doc) => {
		const spacer = doc.createElement("div");
		spacer.dataset.testSpacer = "true";
		spacer.style.height = "3000px";
		(doc.querySelector("main") ?? doc.body).appendChild(spacer);
	});

describe("Sticky header", () => {
	it("pins only the navigation bar on desktop", () => {
		cy.viewport(1440, 900);
		cy.visit(PAGE);
		cy.get("#menu .fr-nav").should("be.visible");

		cy.document().its("documentElement").should("have.attr", "style");
		cy.document().should((doc) => {
			expect(stickyHeaderHeight(doc)).to.be.greaterThan(0);
		});

		givePageRoomToScroll();
		cy.scrollTo(0, 800);

		cy.get("#menu .fr-header__menu").should(($nav) => {
			expect($nav[0].getBoundingClientRect().top).to.be.closeTo(0, 2);
		});
		cy.get("#menu .fr-header__body").should(($body) => {
			expect($body[0].getBoundingClientRect().bottom).to.be.at.most(1);
		});
	});

	it("keeps sticky page elements clear of the pinned navigation bar", () => {
		cy.viewport(1440, 900);
		cy.visit(PAGE);
		cy.get("#menu .fr-nav").should("be.visible");

		cy.document().should((doc) => {
			const gap = getComputedStyle(doc.documentElement)
				.getPropertyValue("--sticky-top")
				.trim();
			expect(gap, "--sticky-top accounts for the pinned nav").to.match(
				/^calc\((?!0px)\d+(\.\d+)?px \+ 1\.25rem\)$/,
			);
		});
	});

	it("leaves the header in the flow on mobile", () => {
		cy.viewport(375, 812);
		cy.visit(PAGE);
		cy.get("#menu").should("exist");

		cy.document().should((doc) => {
			expect(stickyHeaderHeight(doc)).to.equal(0);
			const menu = doc.querySelector("#menu");
			expect(menu).to.not.be.null;
			expect(getComputedStyle(menu as Element).position).to.equal("static");
		});
	});
});
