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

describe("Courses listing filters", () => {
	beforeEach(() => {
		cy.loginAsAdmin();
	});

	const checkbox = (group: string, label: string) =>
		filterGroup(group).contains("label", label).siblings("input");

	it("filters the courses by format and duration", () => {
		const keyword = uniqueTitle("Filtre format");
		const onSite = `${keyword} présentiel courte`;
		const remote = `${keyword} distanciel longue`;
		cy.createCourse({ title: onSite, format: "pres", duration: "lt1j" });
		cy.createCourse({ title: remote, format: "dist", duration: "gt3j" });

		cy.visit(`/formations?search=${encodeURIComponent(keyword)}`);
		cy.waitForHydration();
		cy.get("#results").should("contain", onSite).and("contain", remote);
		cy.get("#results")
			.contains(".fr-card", onSite)
			.should("contain", "Présentiel");

		filterGroup("Format").contains("label", "Présentiel").click();
		cy.location("search").should("include", "formats=pres");
		checkbox("Format", "Présentiel").should("be.checked");
		checkbox("Format", "Distanciel").should("not.be.checked");
		cy.get("#results").should("contain", onSite).and("not.contain", remote);

		filterGroup("Durée").contains("label", "Supérieur à 3j").click();
		cy.location("search").should("include", "durations=gt3j");
		cy.get("#results").should("contain", "Aucune formation trouvée");

		filterGroup("Format").contains("label", "Présentiel").click();
		cy.location("search").should("not.include", "formats=");
		cy.get("#results").should("contain", remote).and("not.contain", onSite);
	});

	it("shows no course for a format value that does not exist", () => {
		cy.visit("/formations?formats=inconnu");
		cy.get("#results").should("contain", "Aucune formation trouvée");
	});
});
