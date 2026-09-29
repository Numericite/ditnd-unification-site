import "./commands";
import "./payload";

Cypress.Keyboard.defaults({ keystrokeDelay: 0 });

let currentPath = "";

// LiteYouTube retries its fallback thumbnail forever when YouTube cannot be
// reached, and the page never finishes loading.
beforeEach(() => {
	cy.intercept("https://i.ytimg.com/**", {
		headers: { "content-type": "image/svg+xml" },
		body: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"/>',
	});
});

Cypress.on("window:before:load", (win) => {
	currentPath = win.location.pathname;
});

// The Payload admin is an App Router page that hydrates the whole document,
// and Cypress injects a script at the top of <head>: every admin page load
// reports a hydration mismatch that never happens in a real browser. Public
// pages hydrate #__next only, so a mismatch there still fails the test.
Cypress.on("uncaught:exception", (error) => {
	if (
		currentPath.startsWith("/admin") &&
		/Minified React error #(418|423|425)/.test(error.message)
	) {
		return false;
	}
});
