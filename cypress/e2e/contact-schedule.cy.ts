// Horaires seedés (src/payload/seed/tasks/home.ts) : 9h–13h et 14h–17h en
// semaine, plus 18h–20h le mardi, fermé le week-end. Les heures sont lues en
// heure de Paris (UTC+1 en novembre).
const visitHomeAt = (isoDate: string) => {
	cy.clock(new Date(isoDate), ["Date"]);
	cy.visit("/");
	cy.waitForHydration();
};

const phoneTile = () =>
	cy.contains("main a", "0 800 71 40 40").parents(".fr-tile").first();

describe("Contact phone schedule", () => {
	it("shows the current slot while the line is open", () => {
		visitHomeAt("2026-11-16T13:30:00Z"); // lundi 14h30
		phoneTile()
			.should("contain.text", "OUVERT")
			.and("contain.text", "Aujourd'hui, 14h – 17h");
	});

	it("announces the next slot of the day between two slots", () => {
		visitHomeAt("2026-11-16T12:30:00Z"); // lundi 13h30
		phoneTile()
			.should("contain.text", "FERMÉ")
			.and("contain.text", "Réouvre aujourd'hui à 14h");
	});

	it("announces the first slot of the next open day", () => {
		visitHomeAt("2026-11-15T12:00:00Z"); // dimanche 13h
		phoneTile().should("contain.text", "Réouvre demain à 9h");
	});

	it("lists the slots of each day in the schedule popover", () => {
		visitHomeAt("2026-11-16T13:30:00Z");
		cy.get('button[aria-label="Voir les horaires de la ligne"]').click();
		cy.contains("th", "Mardi")
			.parent()
			.find("li")
			.then((items) => {
				expect([...items].map((item) => item.textContent)).to.deep.equal([
					"9h – 13h",
					"14h – 17h",
					"18h – 20h",
				]);
			});
		cy.contains("th", "Samedi").parent().should("contain.text", "Fermé");
	});
});
