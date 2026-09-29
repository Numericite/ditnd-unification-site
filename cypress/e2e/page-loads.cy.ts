describe("Page loads", () => {
	const pages = [
		{ path: "/", titleIncludes: "Maison de l'autisme" },
		{ path: "/contact-pros-cra", titleIncludes: "Maison de l'autisme" },
		{ path: "/contact-particuliers", titleIncludes: "Maison de l'autisme" },
		{ path: "/accessibilite", titleIncludes: "Accessibilité" },
		{ path: "/mentions-legales", titleIncludes: "Maison de l'autisme" },
		{ path: "/plan-du-site", titleIncludes: "Maison de l'autisme" },
		{ path: "/fiches-pratiques", titleIncludes: "Fiches pratiques" },
		{
			path: "/fiches-pratiques/le-tsa-explique-aux-familles",
			titleIncludes: "Le TSA expliqué aux familles",
		},
		{ path: "/formations", titleIncludes: "Maison de l'autisme" },
		{
			path: "/formations/comprendre-le-tsa-chez-l-enfant",
			titleIncludes: "Maison de l'autisme",
		},
		{ path: "/parcours/pp", titleIncludes: "Maison de l'autisme" },
		{ path: "/parcours/pp/tsa", titleIncludes: "Maison de l'autisme" },
		{ path: "/a-propos", titleIncludes: "Maison de l'autisme" },
		{
			path: "/a-propos/maison-de-l-autisme",
			titleIncludes: "Maison de l'autisme",
		},
		{ path: "/a-propos/gncra", titleIncludes: "GNCRA" },
		{ path: "/a-propos/cra", titleIncludes: "CRA" },
		{ path: "/a-propos/glossaire", titleIncludes: "Glossaire" },
		{ path: "/cartographie", titleIncludes: "Maison de l'autisme" },
		{ path: "/recherche?search=autisme", titleIncludes: "Maison de l'autisme" },
	];

	for (const page of pages) {
		it(`renders ${page.path} with a 200 response`, () => {
			cy.visit(page.path);
			cy.title().should("include", page.titleIncludes);
			cy.waitForHydration();
		});
	}
});
