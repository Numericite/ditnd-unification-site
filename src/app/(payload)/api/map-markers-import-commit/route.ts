import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { MapCategory } from "../../../../payload/payload-types";

type CustomField = NonNullable<MapCategory["customFields"]>[number];

type CommitRow = Record<string, string>;

function parseCheckboxValue(val: string): boolean | null {
	const v = val.toLowerCase().trim();
	if (v === "oui" || v === "true" || v === "1") return true;
	if (v === "non" || v === "false" || v === "0") return false;
	return null;
}

export async function POST(req: NextRequest) {
	const payload = await getPayload({ config: configPromise });

	const { user } = await payload.auth({ headers: req.headers });
	if (!user) {
		return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
	}

	let body: {
		categoryId: string;
		rows: CommitRow[];
		customFields: CustomField[];
	};
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
	}

	const { categoryId, rows, customFields = [] } = body;

	if (!categoryId || !Array.isArray(rows) || rows.length === 0) {
		return NextResponse.json({ error: "Données invalides" }, { status: 400 });
	}

	const results = {
		total: rows.length,
		created: 0,
		failed: 0,
		errors: [] as Array<{ rowIndex: number; error: string }>,
	};

	const BATCH = 5;
	for (let i = 0; i < rows.length; i += BATCH) {
		await Promise.all(
			rows.slice(i, i + BATCH).map(async (row, j) => {
				const rowIndex = i + j;
				const name = row.nom?.trim();
				const address = row.adresse?.trim();
				const city = row.ville?.trim();

				if (!name || !address || !city) {
					const missing = [
						!name && "nom",
						!address && "adresse",
						!city && "ville",
					]
						.filter(Boolean)
						.join(", ");
					results.failed++;
					results.errors.push({
						rowIndex,
						error: `Champs requis manquants : ${missing}`,
					});
					return;
				}

				// Construire les métadonnées en respectant les types
				const metadata: Record<string, unknown> = {};
				for (const field of customFields) {
					const raw = row[field.key]?.trim();
					if (!raw) continue;
					if (field.type === "checkbox") {
						const boolVal = parseCheckboxValue(raw);
						if (boolVal !== null) metadata[field.key] = boolVal;
					} else {
						metadata[field.key] = raw;
					}
				}

				try {
					await payload.create({
						collection: "map-markers",
						data: {
							name,
							category: Number(categoryId),
							address,
							postalCode: row.codePostal?.trim() || null,
							city,
							phone: row.telephone?.trim() || null,
							email: row.email?.trim() || null,
							website: row.siteWeb?.trim() || null,
							description: row.description?.trim() || null,
							metadata: Object.keys(metadata).length > 0 ? metadata : null,
						},
						user,
						overrideAccess: false,
					});
					results.created++;
				} catch (err) {
					results.failed++;
					results.errors.push({
						rowIndex,
						error: err instanceof Error ? err.message : String(err),
					});
				}
			}),
		);
	}

	return NextResponse.json(results);
}
