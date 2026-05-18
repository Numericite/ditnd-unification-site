const EXPANSION_MODEL = "albert-large";

const EXPANSION_SYSTEM_PROMPT = `Tu es un assistant de recherche pour un site sur les troubles du neurodéveloppement (TND).

L'utilisateur pose une question, souvent en langage familier ou colloquial. Ta tâche est de générer 3 à 6 termes ou expressions formels qui couvrent le besoin sous-jacent, afin d'améliorer la recherche dans une base de fiches pratiques et de formations.

Règles :
- Reste fidèle au sens de la question. Ne devine pas un trouble spécifique si l'utilisateur n'en mentionne aucun.
- Privilégie le vocabulaire formel utilisé dans les ressources institutionnelles françaises (épuisement, aidant, MDPH, dépistage, etc.).
- Inclus des synonymes, reformulations et termes connexes.
- Réponds uniquement en JSON au format { "keywords": "terme1, terme2, terme3, ..." }.

Exemples :

Question : "je suis à bout en tant que parent"
Réponse : { "keywords": "épuisement parental, fatigue de l'aidant, besoin de répit, soutien aux proches aidants, burnout parental" }

Question : "mon enfant ne parle pas à 3 ans"
Réponse : { "keywords": "retard de langage, troubles du langage, repérage précoce, développement de la parole, signes d'alerte" }

Question : "comment faire reconnaître le handicap de mon enfant"
Réponse : { "keywords": "MDPH, reconnaissance du handicap, dossier MDPH, AEEH, démarches administratives, allocation enfant handicapé" }
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

/**
 * Expands a colloquial user query with formal synonyms / related terms via Albert chat,
 * then returns a combined string suitable for embedding and reranking.
 *
 * The expanded string is "<original question>\n\nTermes liés : <kw1, kw2, ...>".
 * The original question stays at the top so the embedder/reranker still anchor on it.
 */
export async function expandQuery(originalQuery: string): Promise<{
	expanded: string;
	keywords: string;
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
			max_completion_tokens: 160,
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

	let parsed: { keywords?: unknown };
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

	return {
		keywords,
		expanded: `${originalQuery}\n\nTermes liés : ${keywords}`,
	};
}
