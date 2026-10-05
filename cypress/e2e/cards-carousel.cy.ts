import { block, heading, richText } from "../support/lexical";

// Seeded guides and courses (src/payload/seed/tasks).
const guide = (id: number) => ({ relationTo: "practical-guides", value: id });
const course = (id: number) => ({ relationTo: "courses", value: id });

const content = richText(
	heading("h2", "Accompagner dans la durée"),
	block("carousel", { items: [1, 2, 3, 4, 5, 6].map(guide) }),
	block("carousel", {
		title: "Formations associées",
		titleAs: "h2",
		items: [course(1), guide(1), course(2)],
	}),
);

const guidesCarousel = () => cy.get('section[aria-label="Fiches pratiques"]');

// Drafts skip the Albert simplification and are rendered by /draft/[slug].
describe("Cards carousel block", () => {
	before(() => {
		cy.loginAsAdmin();
		cy.createPracticalGuide({ content, _status: "draft" }).then((doc) => {
			cy.wrap(doc.slug).as("slug");
		});
	});

	beforeEach(function () {
		cy.loginAsAdmin();
		cy.viewport(1280, 900);
		cy.visit(`/draft/${this.slug}`);
		cy.waitForHydration();
	});

	it("lists every card and scrolls them with the controls", () => {
		guidesCarousel().within(() => {
			cy.get("ul[data-carousel] > li").should("have.length", 6);
			cy.get("li .fr-card h3").should("have.length", 6);
			cy.get('button[aria-label="Cartes précédentes"]').should("be.disabled");
			cy.get('button[aria-label="Cartes suivantes"]')
				.should("have.attr", "aria-controls")
				.then((listId) => {
					cy.get("ul[data-carousel]").should("have.attr", "id", listId);
				});

			cy.get('button[aria-label="Cartes suivantes"]').click();
			cy.get("ul[data-carousel]")
				.its("0.scrollLeft")
				.should("be.greaterThan", 0);
			cy.get("[aria-live=polite]")
				.invoke("text")
				.should("match", /^Cartes? 3 (à \d )?sur 6$/);
			cy.get('button[aria-label="Cartes précédentes"]').should("be.enabled");
		});
	});

	it("keeps focus on a usable control at the end of the list", () => {
		guidesCarousel().within(() => {
			cy.get('button[aria-label="Cartes suivantes"]').focus();
			cy.get("ul[data-carousel]").scrollTo("right");
			cy.get('button[aria-label="Cartes suivantes"]').should("be.disabled");
			cy.focused().should("have.attr", "aria-label", "Cartes précédentes");
		});
	});

	it("scrolls a card into view when it receives keyboard focus", () => {
		guidesCarousel().within(() => {
			cy.get("ul[data-carousel] > li")
				.last()
				.find(".fr-card__footer a")
				.focus();
			cy.get("ul[data-carousel]")
				.its("0.scrollLeft")
				.should("be.greaterThan", 0);
			cy.get('p[aria-hidden="true"]').should("contain.text", "6 / 6");
		});
	});

	it("names a titled carousel after its heading and adds it to the summary", () => {
		cy.get("h2#formations-associees").should(
			"have.text",
			"Formations associées",
		);
		cy.get('section[aria-labelledby="formations-associees"]').within(() => {
			cy.get("li .fr-card h3").should("have.length", 3);
		});
		cy.contains("#summary a", "Formations associées").should(
			"have.attr",
			"href",
			"#formations-associees",
		);
	});

	it("shows one card per view without overflowing the page on mobile", () => {
		cy.viewport(375, 812);
		guidesCarousel().within(() => {
			cy.get('p[aria-hidden="true"]').should("have.text", "1 / 6");
		});
		cy.document().should((doc) => {
			expect(doc.documentElement.scrollWidth).to.be.at.most(375);
		});
	});
});
