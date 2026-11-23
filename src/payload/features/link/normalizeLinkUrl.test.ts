import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeLinkUrl } from "./normalizeLinkUrl";

// Reproduit le hook de @payloadcms/richtext-lexical 3.90 appliqué n fois.
const encodeTimes = (url: string, times: number) => {
	let current = url;
	for (let i = 0; i < times; i++) current = encodeURIComponent(current);
	return current;
};

describe("normalizeLinkUrl", () => {
	it("laisse intactes les URLs saines", () => {
		for (const url of [
			"https://www.site.fr/page",
			"https://site.fr/recherche?q=a%2Fb&x=1",
			"https://site.fr/page#:~:text=un%20passage",
			"/api/medias/file/fiche%20pratique.png",
			"/page?redirect=%2Faccueil",
			"#section",
			"#:~:text=foo",
			"mailto:contact@site.fr?subject=Bonjour%20%C3%A0%20tous",
			"tel:+33123456789",
			"www.site.fr/page",
			"?q=recherche",
		]) {
			assert.equal(normalizeLinkUrl(url), url);
		}
	});

	it("ne touche pas aux valeurs non textuelles", () => {
		assert.equal(normalizeLinkUrl(undefined), undefined);
		assert.equal(normalizeLinkUrl(null), null);
	});

	it("encode les espaces et retire les espaces autour", () => {
		assert.equal(
			normalizeLinkUrl("  /api/medias/file/fiche pratique.png "),
			"/api/medias/file/fiche%20pratique.png",
		);
		assert.equal(normalizeLinkUrl("   "), "");
	});

	it("corrige le protocole doublé ou saisi devant un chemin", () => {
		assert.equal(normalizeLinkUrl("https://https//site.fr"), "https://site.fr");
		assert.equal(
			normalizeLinkUrl("https://https://site.fr"),
			"https://site.fr",
		);
		assert.equal(normalizeLinkUrl("http//site.fr"), "http://site.fr");
		assert.equal(normalizeLinkUrl("https:///api/medias/x"), "/api/medias/x");
	});

	describe("répare les URLs abîmées par le ré-encodage", () => {
		const cases: [original: string, expected: string][] = [
			[
				"/api/medias/file/fiche pratique.png",
				"/api/medias/file/fiche%20pratique.png",
			],
			[
				"/api/medias/file/fiche%20pratique.png",
				"/api/medias/file/fiche%20pratique.png",
			],
			["https://site.fr/page?q=a%2Fb&x=é", "https://site.fr/page?q=a%2Fb&x=é"],
			["#:~:text=foo bar", "#:~:text=foo%20bar"],
			[
				"mailto:a@b.fr?subject=Bonjour à tous",
				"mailto:a@b.fr?subject=Bonjour%20à%20tous",
			],
			["tel:+33 1 23 45 67 89", "tel:+33%201%2023%2045%2067%2089"],
			["www.site.fr/page é", "www.site.fr/page%20é"],
			["?q=a b", "?q=a%20b"],
		];

		for (const [original, expected] of cases) {
			for (const times of [1, 2, 5, 150]) {
				it(`${original} (encodé ${times} fois)`, () => {
					assert.equal(
						normalizeLinkUrl(encodeTimes(original, times)),
						expected,
					);
				});
			}
		}
	});

	it("est idempotent", () => {
		for (const url of [
			encodeTimes("/api/medias/file/a b.pdf", 3),
			encodeTimes("#:~:text=foo bar", 2),
			"https://https//site.fr/a b",
			"https:///api/x",
		]) {
			const once = normalizeLinkUrl(url);
			assert.equal(normalizeLinkUrl(once), once);
		}
	});
});
