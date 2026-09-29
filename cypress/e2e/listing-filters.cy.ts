import { uniqueTitle } from "../support/payload";

// Seeded by src/payload/seed/tasks/themes.ts and conditions.ts.
const THEME = { id: 7, name: "Droit" };
const ALL_CONDITION_IDS = [1, 2, 3, 4];
const AUTISM = { id: 4, name: "Trouble du spectre autistique" };

const filterGroup = (label: string) =>
	cy.contains(".fr-accordion__btn", label).closest(".fr-accordion");

const setThemeHidden = (isHidden: boolean) =>
	cy.request("PATCH", `/api/themes/${THEME.id}`, { isHidden });

describe("Practical guides listing filters", () => {
	beforeEach(() => {
		cy.loginAsAdmin();
	});

	it("sorts the themes and leaves out the one hidden in the back office", () => {
		setThemeHidden(true);
		cy.visit("/fiches-pratiques");
		filterGroup("Thématiques")
			.find("label")
			.should(($labels) => {
				const names = [...$labels].map((label) => label.textContent?.trim());
				expect(names).to.have.length.greaterThan(1);
				expect(names).not.to.include(THEME.name);
				expect(names).to.deep.equal(
					[...names].sort((a, b) => (a ?? "").localeCompare(b ?? "", "fr")),
				);
			});

		setThemeHidden(false);
		cy.visit("/fiches-pratiques");
		filterGroup("Thématiques").should("contain", THEME.name);
	});

	it("keeps only the guides covering every condition with « Tous TND »", () => {
		const keyword = uniqueTitle("Filtre TND");
		cy.createPracticalGuide({
			title: `${keyword} tous troubles`,
			conditions: ALL_CONDITION_IDS,
		});
		cy.createPracticalGuide({
			title: `${keyword} autisme seul`,
			conditions: [AUTISM.id],
		});

		cy.visit(`/fiches-pratiques?search=${encodeURIComponent(keyword)}`);
		cy.waitForHydration();
		cy.get("#results")
			.should("contain", `${keyword} tous troubles`)
			.and("contain", `${keyword} autisme seul`);

		filterGroup("Troubles").contains("label", AUTISM.name).click();
		filterGroup("Troubles").contains("label", "Tous TND").click();
		cy.location("search").should("include", "conditions=tous-tnd");
		filterGroup("Troubles")
			.contains("label", AUTISM.name)
			.siblings("input")
			.should("not.be.checked");
		cy.get("#results")
			.should("contain", `${keyword} tous troubles`)
			.and("not.contain", `${keyword} autisme seul`);
	});
});
