import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { simplifyMarkdown } from "../../../../payload/services/contentSimplification";

const MAX_SOURCE_LENGTH = 100_000;

export async function POST(req: NextRequest) {
	const payload = await getPayload({ config: configPromise });

	const { user } = await payload.auth({ headers: req.headers });
	if (!user) {
		return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
	}

	let body: { markdown?: unknown };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json(
			{ error: "Corps de requête invalide" },
			{ status: 400 },
		);
	}

	const markdown = body.markdown;
	if (typeof markdown !== "string" || !markdown.trim()) {
		return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
	}
	if (markdown.length > MAX_SOURCE_LENGTH) {
		return NextResponse.json({ error: "Contenu trop long" }, { status: 413 });
	}

	const result = await simplifyMarkdown(markdown);
	if (!result.ok) {
		payload.logger.error(
			`Simplified content generation failed: ${result.error}`,
		);
		return NextResponse.json(
			{ error: "La génération a échoué. Veuillez réessayer." },
			{ status: 502 },
		);
	}

	return NextResponse.json({ markdown: result.markdown });
}
