const LOCKED = ["Je suis", "Fiches pratiques", "Me former"];

describe("Admin — main menu", () => {
	beforeEach(() => {
		cy.loginAsAdmin();
		cy.visitAdmin("/globals/menu");
	});

	it("shows the locked items above the editable items, without actions", () => {
		cy.get(".array-field__draggable-rows")
			.first()
			.find("> .collapsible")
			.should("have.length", LOCKED.length)
			.each((row, index) => {
				cy.wrap(row)
					.should("have.attr", "title", "Élément fixe : non modifiable")
					.find(".array-field__row-header")
					.should("have.text", LOCKED[index]);
				cy.wrap(row).find(".collapsible__drag svg").should("be.visible");
				cy.wrap(row)
					.find('[aria-roledescription="sortable"]')
					.should("not.exist");
				cy.wrap(row).find("button").should("not.exist");
			});

		cy.get('[id^="items-row-"]')
			.first()
			.find(".array-field__row-header")
			.should("have.text", "Annuaire");
	});
});
