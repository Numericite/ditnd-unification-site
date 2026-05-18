const EXPANSION_MODEL = "albert-large";

export type RagSource = "guides" | "courses";

const EXPANSION_SYSTEM_PROMPT = `Tu es un assistant de recherche pour un site sur les troubles du neurodéveloppement (TND).

Le site contient deux types de ressources :
- "guides" : fiches pratiques expliquant des démarches, droits, conseils du quotidien, repérage, accompagnement
- "courses" : formations, MOOC, webinaires, parcours destinés à apprendre ou se former

À partir de la question de l'utilisateur :
1. Détermine quel(s) type(s) de ressource(s) répondent le mieux à son besoin.
2. Génère 3 à 6 termes ou expressions formels en français pour la recherche.

Règles d'intent :
- L'utilisateur veut apprendre, se former, suivre une formation/MOOC/webinaire, monter en compétence → ["courses"]
- L'utilisateur cherche des démarches, droits, conseils, informations pratiques sur le quotidien → ["guides"]
- La question est ambiguë, générale ou pourrait être servie par les deux → ["guides", "courses"]

Règles de keywords :
- Reste fidèle au sens de la question. Ne devine pas un trouble spécifique si l'utilisateur n'en mentionne aucun.
- Privilégie le vocabulaire formel utilisé dans les ressources institutionnelles françaises (épuisement, aidant, MDPH, dépistage, etc.).

Réponds uniquement en JSON :
{ "targetSources": ["guides" et/ou "courses"], "keywords": "terme1, terme2, ..." }

Exemples :

Question : "je suis à bout en tant que parent"
Réponse : { "targetSources": ["guides", "courses"], "keywords": "épuisement parental, fatigue de l'aidant, besoin de répit, soutien aux proches aidants, burnout parental" }

Question : "je veux me former en tant que professionnel"
Réponse : { "targetSources": ["courses"], "keywords": "formation professionnelle, sensibilisation TND, formation continue, accompagnement TSA, repérage précoce" }

Question : "comment fonctionne la MDPH ?"
Réponse : { "targetSources": ["guides"], "keywords": "MDPH, dossier MDPH, reconnaissance handicap, démarches administratives, allocation handicap" }

Question : "mon enfant ne parle pas à 3 ans"
Réponse : { "targetSources": ["guides", "courses"], "keywords": "retard de langage, troubles du langage, repérage précoce, développement de la parole, signes d'alerte" }
`;

type AlbertChatResponse = {
	choices?: { message?: { content?: string } }[];
};

function getAlbertConfig(): { apiKey: string; apiUrl: string } {
	const apiKey = process.env.ALBERT_API_KEY;
	const apiUrl = process.env.ALBERT_API_URL;
	if (!apiKey || !apiUrl) {
		throw new Error(
			"ALBERT_API_KEY or ALBERT_API_URL is not configured — required for query expansion",
		);
	}
	return { apiKey, apiUrl };
}

function parseTargetSources(raw: unknown): RagSource[] {
	if (!Array.isArray(raw)) return ["guides", "courses"];
	const valid = raw.filter(
		(s): s is RagSource => s === "guides" || s === "courses",
	);
	// Dedup while preserving order, default to both if nothing valid.
	const seen = new Set<RagSource>();
	const ordered: RagSource[] = [];
	for (const s of valid) {
		if (!seen.has(s)) {
			seen.add(s);
			ordered.push(s);
		}
	}
	return ordered.length > 0 ? ordered : ["guides", "courses"];
}

/**
 * Expands a colloquial user query via Albert chat:
 * - Detects which resource type(s) match the user's intent (guides, courses, or both)
 * - Generates formal French synonyms / related terms to bridge to corpus vocabulary
 *
 * The expanded string is "<original question>\n\nTermes liés : <kw1, kw2, ...>".
 * The original question stays at the top so embedder/reranker still anchor on it.
 */
export async function expandQuery(originalQuery: string): Promise<{
	expanded: string;
	keywords: string;
	targetSources: RagSource[];
}> {
	const { apiKey, apiUrl } = getAlbertConfig();

	const response = await fetch(`${apiUrl}/v1/chat/completions`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: EXPANSION_MODEL,
			messages: [
				{ role: "system", content: EXPANSION_SYSTEM_PROMPT },
				{ role: "user", content: originalQuery },
			],
			temperature: 0.2,
			response_format: { type: "json_object" },
			max_completion_tokens: 200,
		}),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(
			`Albert chat (expansion) error ${response.status}: ${response.statusText} — ${body}`,
		);
	}

	const data = (await response.json()) as AlbertChatResponse;
	const content = data.choices?.[0]?.message?.content;
	if (!content) {
		throw new Error("Albert expansion response was empty");
	}

	let parsed: { keywords?: unknown; targetSources?: unknown };
	try {
		parsed = JSON.parse(content);
	} catch {
		throw new Error(`Albert expansion response was not valid JSON: ${content}`);
	}

	const keywords =
		typeof parsed.keywords === "string" ? parsed.keywords.trim() : "";
	if (!keywords) {
		throw new Error("Albert expansion response missing `keywords` string");
	}

	const targetSources = parseTargetSources(parsed.targetSources);

	return {
		keywords,
		targetSources,
		expanded: `${originalQuery}\n\nTermes liés : ${keywords}`,
	};
}
