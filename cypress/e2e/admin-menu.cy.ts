const LOCKED = [
	{ key: "personas", title: "Je suis" },
	{ key: "practicalGuides", title: "Fiches pratiques" },
];

describe("Admin — main menu", () => {
	beforeEach(() => {
		cy.loginAsAdmin();
		cy.visitAdmin("/globals/menu");
	});

	it("shows the locked items above the editable items, without a drag handle", () => {
		cy.get(".array-field__draggable-rows")
			.first()
			.find("> .collapsible")
			.should("have.length", LOCKED.length)
			.each((row, index) => {
				cy.wrap(row)
					.find(".array-field__row-header")
					.should("contain.text", LOCKED[index]?.title)
					.and("contain.text", "Élément fixe");
				cy.wrap(row).find(".collapsible__drag").should("not.exist");
			});

		cy.get('[id^="items-row-"]')
			.first()
			.find(".array-field__row-header")
			.first()
			.should("have.text", "Me former");
	});

	it("lets editors rename and hide the locked items", () => {
		for (const { key, title } of LOCKED) {
			cy.get(`#field-lockedItems__${key}__title`).should("have.value", title);
			cy.get(`#field-lockedItems__${key}__visible`).should("be.checked");
		}
	});
});
