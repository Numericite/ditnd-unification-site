describe("Page loads", () => {
	const pages = [
		{ path: "/", titleIncludes: "Maison de l'autisme" },
		{ path: "/contact-pros-cra", titleIncludes: "Maison de l'autisme" },
		{ path: "/contact-particuliers", titleIncludes: "Maison de l'autisme" },
		{ path: "/accessibilite", titleIncludes: "Accessibilité" },
		{ path: "/mentions-legales", titleIncludes: "Maison de l'autisme" },
		{ path: "/plan-du-site", titleIncludes: "Maison de l'autisme" },
	];

	for (const page of pages) {
		it(`renders ${page.path} with a 200 response`, () => {
			cy.request(page.path).its("status").should("eq", 200);
			cy.visit(page.path);
			cy.title().should("include", page.titleIncludes);
		});
	}
});
