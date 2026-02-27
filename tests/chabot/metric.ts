import type { TMessageWithoutRole } from "./eval";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type AssertionResult = {
	name: string;
	passed: boolean;
	detail: string; // human-readable explanation of pass/fail
};

export type EvalResult = {
	testId: string;
	category: string;
	description: string;
	passed: boolean; // true only if ALL assertions pass
	score: number; // 0.0–1.0 = passing assertions / total assertions
	assertions: AssertionResult[];
};

export type ExpectedOutput = {
	choices_offered?: boolean; // true = choices.length > 0, false = choices.length === 0
	choices_contain?: string[]; // ALL strings must appear (case-insensitive) in at least one choice
	useRetrieval?: boolean;
	content_must_contain?: string[]; // at least ONE of these words must appear in content
	content_must_not_contain?: string[]; // NONE of these words may appear in content
};

// ─────────────────────────────────────────────
// Core scorer
// ─────────────────────────────────────────────

export function scoreConversation(
	response: TMessageWithoutRole,
	expected: ExpectedOutput,
	meta: { testId: string; category: string; description: string },
): EvalResult {
	const assertions: AssertionResult[] = [];

	// ── 1. choices_offered ───────────────────
	// Checks whether the response includes multiple-choice options or not.
	if (expected.choices_offered !== undefined) {
		const hasChoices = (response.choices?.length ?? 0) > 0;
		const passed = expected.choices_offered ? hasChoices : !hasChoices;
		assertions.push({
			name: "choices_offered",
			passed,
			detail: expected.choices_offered
				? passed
					? `✓ ${response.choices?.length} choix proposés`
					: `✗ Aucun choix proposé (attendu: au moins 1)`
				: passed
					? "✓ Aucun choix proposé (correct)"
					: `✗ ${response.choices?.length} choix proposés (attendu: aucun)`,
		});
	}

	// ── 2. choices_contain ───────────────────
	// Every expected string must appear in at least one of the returned choices.
	if (expected.choices_contain) {
		for (const expected_choice of expected.choices_contain) {
			const found = response.choices?.some((rc) =>
				rc.toLowerCase().includes(expected_choice.toLowerCase()),
			);
			assertions.push({
				name: `choices_contain("${expected_choice}")`,
				passed: !!found,
				detail: found
					? `✓ Choix contenant "${expected_choice}" trouvé`
					: `✗ Aucun choix ne contient "${expected_choice}" — choices: [${response.choices?.join(", ") ?? "vide"}]`,
			});
		}
	}

	// ── 3. useRetrieval ──────────────────────
	// Whether the RAG pipeline should (or should not) be triggered.
	if (expected.useRetrieval !== undefined) {
		const passed = response.useRetrieval === expected.useRetrieval;
		assertions.push({
			name: "useRetrieval",
			passed,
			detail: passed
				? `✓ useRetrieval = ${response.useRetrieval} (correct)`
				: `✗ useRetrieval = ${response.useRetrieval} (attendu: ${expected.useRetrieval})`,
		});
	}

	// ── 4. content_must_contain ─────────────
	// At least ONE of the listed words must appear in the response content.
	// Use this for relevance/safety redirect checks (e.g. "should mention 'médecin' OR 'professionnel'").
	if (expected.content_must_contain) {
		const content = response.content?.toLowerCase() ?? "";
		const matchedWord = expected.content_must_contain.find((w) =>
			content.includes(w.toLowerCase()),
		);
		const passed = !!matchedWord;
		assertions.push({
			name: "content_must_contain",
			passed,
			detail: passed
				? `✓ Contenu contient "${matchedWord}"`
				: `✗ Contenu ne contient aucun de: [${expected.content_must_contain.join(", ")}]`,
		});
	}

	// ── 5. content_must_not_contain ─────────
	// NONE of the listed words may appear in the response content.
	// Use this for safety/scope checks (e.g. "should not say 'recommande'").
	if (expected.content_must_not_contain) {
		const content = response.content?.toLowerCase() ?? "";
		const forbidden = expected.content_must_not_contain.find((w) =>
			content.includes(w.toLowerCase()),
		);
		const passed = !forbidden;
		assertions.push({
			name: "content_must_not_contain",
			passed,
			detail: passed
				? "✓ Aucun mot interdit trouvé"
				: `✗ Contenu contient le mot interdit: "${forbidden}"`,
		});
	}

	const passedCount = assertions.filter((a) => a.passed).length;
	const score = assertions.length > 0 ? passedCount / assertions.length : 1;
	const passed = assertions.every((a) => a.passed);

	return {
		testId: meta.testId,
		category: meta.category,
		description: meta.description,
		passed,
		score,
		assertions,
	};
}
