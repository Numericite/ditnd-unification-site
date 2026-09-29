import {
	accordion,
	block,
	heading,
	horizontalRule,
	inlineBlock,
	link,
	list,
	paragraph,
	relationship,
	richText,
	TEXT_FORMAT,
	table,
	text,
	upload,
} from "../support/lexical";

// Seeded guides (src/payload/seed/tasks/practical-guides.ts) and medias.
const LINKED_GUIDE = {
	id: 2,
	slug: "ou-trouver-du-soutien-et-du-repit-en-tant-que-proche-aidant",
};
const CARD_GUIDE = {
	id: 3,
	title: "Se former quand on est proche aidant d’une personne autiste",
	slug: "se-former-quand-on-est-proche-aidant-d-une-personne-autiste",
};
const UPLOAD_ALT = "Une salle de classe en pleins cours de mathématique";

const content = richText(
	heading("h2", "Comprendre les besoins"),
	paragraph(
		text("Texte en gras", TEXT_FORMAT.bold),
		" et ",
		text("texte en italique", TEXT_FORMAT.italic),
		".",
	),
	paragraph(
		"Le ",
		inlineBlock("lang", { text: "burn-out", lang: "en" }),
		" des aidants.",
	),
	list("ul", [["Premier point"], ["Second point"]]),
	list("ol", [["Étape une"], ["Étape deux"]]),
	paragraph(
		link("site officiel", {
			linkType: "custom",
			url: "https://www.service-public.fr",
			newTab: true,
		}),
	),
	paragraph(
		link("fiche sur le répit", {
			linkType: "internal",
			doc: { relationTo: "practical-guides", value: LINKED_GUIDE.id },
		}),
	),
	horizontalRule(),
	heading("h3", "Sous-partie"),
	table([
		["Aide", "Montant"],
		["AEEH", "151 €"],
	]),
	block("callout", {
		title: "À retenir",
		titleAs: "h2",
		content: richText(paragraph("Contenu de la mise en avant.")),
		iconId: "fr-icon-seedling-line",
		colorVariant: "blue-ecume",
	}),
	block("callout", {
		title: "Encadré secondaire",
		titleAs: "h4",
		content: richText(paragraph("Hors du sommaire.")),
	}),
	block("citation", {
		quote: "Une citation inspirante.",
		author: "Une autrice",
		source: "Un ouvrage de référence",
		sourceUrl: "https://example.org",
		size: "large",
	}),
	block("highlight", {
		content: richText(paragraph("Texte mis en exergue.")),
		size: "lg",
	}),
	block("image", {
		image: 1,
		size: "small",
		altType: "nonDecorative",
		alt: "Amphithéâtre plein",
	}),
	block("image", { image: 2, size: "thumbnail", altType: "decorative" }),
	upload(3),
	relationship("practical-guides", CARD_GUIDE.id),
	accordion("multiple", [
		{ title: "Question une", children: [paragraph("Réponse une.")] },
		{ title: "Question deux", children: [paragraph("Réponse deux.")] },
	]),
	accordion("single", [
		{ title: "Question seule", children: [paragraph("Réponse seule.")] },
	]),
	block("youtube", {
		url: "https://youtu.be/dQw4w9WgXcQ",
		sizeUnit: "percent",
		sizeValue: 80,
	}),
	heading("h2", "Pour aller plus loin"),
);

describe("Rich text rendering on the public site", () => {
	before(() => {
		cy.loginAsAdmin();
		cy.createPracticalGuide({ content }).then((guide) => {
			cy.waitForSimplification(guide.id);
			cy.wrap(guide.slug).as("slug");
		});
	});

	beforeEach(function () {
		cy.visit(`/fiches-pratiques/${this.slug}`);
		cy.waitForHydration();
	});

	it("expands and collapses a multiple accordion group at once", () => {
		const toggles = () =>
			cy
				.contains(".fr-accordion__btn", "Question une")
				.closest(".fr-accordions-group")
				.find(".fr-accordion__btn");

		cy.contains(".fr-accordion__btn", "Question seule")
			.closest(".fr-accordions-group")
			.parent()
			.should("not.contain", "Tout déplier");

		toggles()
			.should("have.length", 2)
			.and("have.attr", "data-fr-js-collapse-button", "true");
		cy.contains("button", "Tout déplier").click();
		toggles().each(($toggle) => {
			cy.wrap($toggle).should("have.attr", "aria-expanded", "true");
		});
		cy.contains("Réponse deux.").should("be.visible");

		cy.contains("button", "Tout replier").click();
		toggles().each(($toggle) => {
			cy.wrap($toggle).should("have.attr", "aria-expanded", "false");
		});
		cy.contains("button", "Tout déplier");
	});

	it("builds the summary from the h2 headings and the h2 callouts", () => {
		cy.get("#summary a")
			.then(($links) =>
				[...$links].map((link) => [
					link.textContent,
					link.getAttribute("href"),
				]),
			)
			.should("deep.equal", [
				["Comprendre les besoins", "#comprendre-les-besoins"],
				["À retenir", "#a-retenir"],
				["Pour aller plus loin", "#pour-aller-plus-loin"],
			]);
		cy.get("h2#comprendre-les-besoins").should("exist");
		cy.get(".fr-callout#a-retenir h2").should("have.text", "À retenir");

		cy.contains("#summary a", "Pour aller plus loin").click();
		cy.location("hash").should("eq", "#pour-aller-plus-loin");
		cy.get("h2#pour-aller-plus-loin").should(($heading) => {
			const { top } = $heading[0].getBoundingClientRect();
			expect(top).to.be.within(0, Cypress.config("viewportHeight"));
		});
	});

	it("renders text, lists, links and tables", () => {
		cy.contains("strong", "Texte en gras");
		cy.contains("em", "texte en italique");
		cy.get('span[lang="en"]').should("have.text", "burn-out");
		cy.contains("ul li", "Second point");
		cy.contains("ol li", "Étape deux");
		cy.contains("a", "site officiel")
			.should("have.attr", "href", "https://www.service-public.fr")
			.and("have.attr", "target", "_blank")
			.and("have.attr", "aria-label", "site officiel, nouvelle fenêtre");
		cy.contains("a", "fiche sur le répit").should(
			"have.attr",
			"href",
			`/fiches-pratiques/${LINKED_GUIDE.slug}`,
		);
		cy.get(".payload-richtext hr").should("exist");
		cy.contains("h3", "Sous-partie");
		cy.get(".fr-table").within(() => {
			cy.contains("th", "Aide");
			cy.contains("td", "151 €");
		});
	});

	it("renders the custom blocks", () => {
		cy.get(".fr-callout#a-retenir")
			.should("have.class", "fr-icon-seedling-line")
			.and("have.class", "fr-callout--blue-ecume")
			.and("contain.text", "Contenu de la mise en avant.")
			.then(($callout) => {
				const icon = getComputedStyle($callout[0], "::before");
				expect(icon.maskImage || icon.webkitMaskImage).to.contain(
					"seedling-line",
				);
			});
		cy.contains(".fr-callout h4", "Encadré secondaire");

		cy.get(".fr-quote").within(() => {
			cy.contains("blockquote", "Une citation inspirante.");
			cy.contains("Une autrice");
			cy.contains("a", "Un ouvrage de référence").should(
				"have.attr",
				"href",
				"https://example.org",
			);
		});
		cy.contains(".fr-highlight .fr-text--lg", "Texte mis en exergue.");

		cy.get('img[alt="Amphithéâtre plein"]').should("have.attr", "width", "600");
		cy.get('img[role="presentation"][width="300"]').should(
			"have.attr",
			"alt",
			"",
		);
		cy.get(`img[alt="${UPLOAD_ALT}"]`).should("be.visible");

		cy.contains(".fr-card", CARD_GUIDE.title)
			.find("a")
			.should("have.attr", "href", `/fiches-pratiques/${CARD_GUIDE.slug}`);

		cy.contains("button", "Voir la vidéo YouTube").should("be.visible");
	});
});
