import goldenDataset from "./golden-dataset.json";
import {
	scoreConversation,
	type EvalResult,
	type ExpectedOutput,
} from "./metric";
import { appRouter } from "~/server/api/root";
import { getPayload } from "payload";
import payloadConfig from "@payload-config";
import { createCallerFactory } from "~/server/api/trpc";
import { messageSchema, type TMessage } from "~/server/api/routers/ai";
import type { z } from "zod";

const MessageWithoutRoleSchema = messageSchema.omit({ role: true });
export type TMessageWithoutRole = z.infer<typeof MessageWithoutRoleSchema>;

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const PASS_THRESHOLD = 1.0; // a test passes only if all assertions pass
const CATEGORY_ORDER = [
	"persona",
	"flow",
	"retrieval",
	"safety",
	"scope",
] as const;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
	return arr.reduce(
		(acc, item) => {
			const k = key(item);
			if (!acc[k]) acc[k] = [];
			acc[k].push(item);
			return acc;
		},
		{} as Record<string, T[]>,
	);
}

function categoryLabel(cat: string): string {
	const labels: Record<string, string> = {
		persona: "Identification du persona",
		flow: "Progression de la conversation",
		retrieval: "Déclenchement du RAG",
		safety: "Sécurité médicale",
		scope: "Périmètre thématique",
	};
	return labels[cat] ?? cat;
}

function printDivider(char = "─", width = 60) {
	console.log(char.repeat(width));
}

// ─────────────────────────────────────────────
// Single-prompt evaluation
// ─────────────────────────────────────────────

async function runEval(
	promptName: string,
	label: string,
): Promise<{
	label: string;
	promptName: string;
	globalScore: number;
	passRate: number;
	results: EvalResult[];
}> {
	const results: EvalResult[] = [];

	const payload = await getPayload({ config: payloadConfig });
	const createCaller = createCallerFactory(appRouter);
	const client = createCaller({ payload });

	// Run sequentially to avoid rate-limit issues on the Albert API
	for (const testCase of goldenDataset) {
		try {
			const response = await client.ai.chatbotSend({
				promptName,
				messages: [...testCase.conversation] as TMessage[],
			});

			// If the route returned an array of documents, useRetrieval was true
			const normalizedResponse: TMessageWithoutRole = Array.isArray(response)
				? { content: "", choices: [], useRetrieval: true }
				: response;

			const result = scoreConversation(
				normalizedResponse,
				testCase.expected as ExpectedOutput,
				{
					testId: testCase.id,
					category: testCase.category,
					description: testCase.description,
				},
			);

			results.push(result);
		} catch (error) {
			console.error(`  [ERREUR] ${testCase.id}: ${(error as Error).message}`);
			results.push({
				testId: testCase.id,
				category: testCase.category,
				description: testCase.description,
				passed: false,
				score: 0,
				assertions: [
					{
						name: "api_call",
						passed: false,
						detail: `✗ Erreur API: ${(error as Error).message}`,
					},
				],
			});
		}
	}

	const globalScore = results.reduce((s, r) => s + r.score, 0) / results.length;
	const passRate = results.filter((r) => r.passed).length / results.length;

	return { label, promptName, globalScore, passRate, results };
}

// ─────────────────────────────────────────────
// Report printer
// ─────────────────────────────────────────────

function printReport(evalData: {
	label: string;
	promptName: string;
	globalScore: number;
	passRate: number;
	results: EvalResult[];
}) {
	const { label, promptName, globalScore, passRate, results } = evalData;

	console.log(`\n${"═".repeat(60)}`);
	console.log(`  ${label}  (${promptName})`);
	console.log(`${"═".repeat(60)}`);
	console.log(
		`  Score global : ${(globalScore * 100).toFixed(1)}%   |   Tests réussis : ${results.filter((r) => r.passed).length}/${results.length} (${(passRate * 100).toFixed(0)}%)`,
	);

	const byCategory = groupBy(results, (r) => r.category);

	for (const category of CATEGORY_ORDER) {
		const categoryResults = byCategory[category];
		if (!categoryResults?.length) continue;

		const catScore =
			categoryResults.reduce((s, r) => s + r.score, 0) / categoryResults.length;
		const catPassed = categoryResults.filter((r) => r.passed).length;

		printDivider();
		console.log(
			`  ${categoryLabel(category).toUpperCase()}  — ${catPassed}/${categoryResults.length} réussis  (moy. ${(catScore * 100).toFixed(0)}%)`,
		);
		printDivider();

		for (const result of categoryResults) {
			const icon = result.passed ? "✅" : "❌";
			const scoreStr = `${(result.score * 100).toFixed(0)}%`.padStart(4);
			console.log(
				`\n  ${icon} [${scoreStr}] ${result.testId} — ${result.description}`,
			);

			for (const assertion of result.assertions) {
				const prefix = assertion.passed ? "      " : "    ► ";
				console.log(`${prefix}${assertion.detail}`);
			}
		}
	}

	printDivider("═");
}

// ─────────────────────────────────────────────
// A/B comparison printer
// ─────────────────────────────────────────────

function printComparison(
	a: {
		label: string;
		globalScore: number;
		passRate: number;
		results: EvalResult[];
	},
	b: {
		label: string;
		globalScore: number;
		passRate: number;
		results: EvalResult[];
	},
) {
	console.log(`\n${"═".repeat(60)}`);
	console.log("  COMPARAISON A/B");
	console.log(`${"═".repeat(60)}`);

	const scoreDiff = a.globalScore - b.globalScore;
	const winner = scoreDiff >= 0 ? a : b;
	const loser = scoreDiff >= 0 ? b : a;
	const diffPct = (Math.abs(scoreDiff) * 100).toFixed(1);

	console.log(`  🏆 Vainqueur : ${winner.label}`);
	console.log(
		`     ${winner.label.padEnd(20)} Score: ${(winner.globalScore * 100).toFixed(1)}%  |  Taux de réussite: ${(winner.passRate * 100).toFixed(0)}%`,
	);
	console.log(
		`     ${loser.label.padEnd(20)} Score: ${(loser.globalScore * 100).toFixed(1)}%  |  Taux de réussite: ${(loser.passRate * 100).toFixed(0)}%`,
	);
	console.log(`     Écart: +${diffPct}pts en faveur de ${winner.label}`);

	// Per-category breakdown
	const byCategory_a = groupBy(a.results, (r) => r.category);
	const byCategory_b = groupBy(b.results, (r) => r.category);

	console.log("\n  Résultats par catégorie :");
	printDivider();
	console.log(
		`  ${"Catégorie".padEnd(28)} ${"Prompt A".padStart(8)}   ${"Prompt B".padStart(8)}   Δ`,
	);
	printDivider();

	for (const category of CATEGORY_ORDER) {
		const catResults_a = byCategory_a[category] ?? [];
		const catResults_b = byCategory_b[category] ?? [];
		if (!catResults_a.length && !catResults_b.length) continue;

		const score_a = catResults_a.length
			? catResults_a.reduce((s, r) => s + r.score, 0) / catResults_a.length
			: 0;
		const score_b = catResults_b.length
			? catResults_b.reduce((s, r) => s + r.score, 0) / catResults_b.length
			: 0;
		const delta = score_a - score_b;
		const deltaStr =
			Math.abs(delta) < 0.005
				? "  ="
				: delta > 0
					? `+${(delta * 100).toFixed(0)}% (A)`
					: `-${(Math.abs(delta) * 100).toFixed(0)}% (B)`;

		const name = categoryLabel(category).padEnd(28);
		console.log(
			`  ${name} ${`${(score_a * 100).toFixed(0)}%`.padStart(8)}   ${`${(score_b * 100).toFixed(0)}%`.padStart(8)}   ${deltaStr}`,
		);
	}
	printDivider("═");
}

// ─────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────

async function main() {
	const args = process.argv.slice(2);
	const mode = args.includes("--ab") ? "ab" : "single";
	const promptArg = args.find((a) => a.startsWith("--prompt="))?.split("=")[1];

	if (mode === "ab") {
		// Run A then B sequentially (not in parallel) to avoid rate-limiting
		const resultA = await runEval("chatbot-system.md", "Prompt A (EN)");
		printReport(resultA);

		const resultB = await runEval("chatbot-system-v2.md", "Prompt B (FR)");
		printReport(resultB);

		printComparison(resultA, resultB);
	} else {
		const promptName = promptArg ?? "chatbot-system.md";
		const label = `Évaluation — ${promptName}`;
		const result = await runEval(promptName, label);
		printReport(result);
	}
	process.exit(0);
}

await main();
