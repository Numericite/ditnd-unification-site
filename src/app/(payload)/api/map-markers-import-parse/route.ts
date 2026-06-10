import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import ExcelJS from "exceljs";
import type { MapCategory } from "../../../../payload/payload-types";

type CustomField = NonNullable<MapCategory["customFields"]>[number];

const BASE_HEADER_ALIASES: Record<string, string> = {
	nom: "nom",
	"nom *": "nom",
	name: "nom",
	adresse: "adresse",
	"adresse *": "adresse",
	address: "adresse",
	"code postal": "codePostal",
	codepostal: "codePostal",
	code_postal: "codePostal",
	ville: "ville",
	"ville *": "ville",
	city: "ville",
	téléphone: "telephone",
	telephone: "telephone",
	phone: "telephone",
	email: "email",
	courriel: "email",
	"site web": "siteWeb",
	siteweb: "siteWeb",
	website: "siteWeb",
	"site internet": "siteWeb",
	description: "description",
};

function normalizeHeader(h: string): string {
	return h
		.toLowerCase()
		.trim()
		.replace(/\s*\*\s*$/, "")
		.trim();
}

function cellToString(cell: ExcelJS.Cell): string {
	const { value } = cell;
	if (value === null || value === undefined) return "";
	if (typeof value === "object") {
		if ("richText" in value) {
			return (value as ExcelJS.CellRichTextValue).richText
				.map((r) => r.text)
				.join("");
		}
		if ("result" in value) {
			const r = (value as ExcelJS.CellFormulaValue).result;
			return r === null || r === undefined ? "" : String(r);
		}
		if (value instanceof Date) {
			return value.toLocaleDateString("fr-FR");
		}
		if ("text" in value) {
			return String((value as { text: string }).text);
		}
	}
	return String(value);
}

export async function POST(req: NextRequest) {
	const payload = await getPayload({ config: configPromise });

	const { user } = await payload.auth({ headers: req.headers });
	if (!user) {
		return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
	}

	let formData: FormData;
	try {
		formData = await req.formData();
	} catch {
		return NextResponse.json(
			{ error: "Corps de requête invalide" },
			{ status: 400 },
		);
	}

	const categoryId = formData.get("categoryId") as string | null;
	const file = formData.get("file") as File | null;

	if (!categoryId || !file || typeof file === "string") {
		return NextResponse.json(
			{ error: "Catégorie et fichier requis" },
			{ status: 400 },
		);
	}

	let category: MapCategory;
	try {
		category = await payload.findByID({
			collection: "map-categories",
			id: categoryId,
		});
	} catch {
		return NextResponse.json(
			{ error: "Catégorie introuvable" },
			{ status: 404 },
		);
	}

	const bytes = await file.arrayBuffer();
	const workbook = new ExcelJS.Workbook();
	try {
		await workbook.xlsx.load(bytes);
	} catch {
		return NextResponse.json(
			{ error: "Fichier Excel invalide ou corrompu" },
			{ status: 400 },
		);
	}

	const sheet = workbook.getWorksheet("Points") ?? workbook.worksheets[0];
	if (!sheet) {
		return NextResponse.json(
			{ error: "Aucune feuille trouvée dans le fichier" },
			{ status: 400 },
		);
	}

	const customFields: CustomField[] = category.customFields ?? [];

	// Mapping colonne → clé de champ
	const colMap: Record<number, string> = {};
	const headerRow = sheet.getRow(1);
	headerRow.eachCell((cell, colIndex) => {
		const raw = cellToString(cell);
		const normalized = normalizeHeader(raw);

		if (BASE_HEADER_ALIASES[normalized]) {
			colMap[colIndex] = BASE_HEADER_ALIASES[normalized];
			return;
		}
		const match = customFields.find(
			(f) => normalizeHeader(f.label) === normalized,
		);
		if (match) colMap[colIndex] = match.key;
	});

	if (Object.keys(colMap).length === 0) {
		return NextResponse.json(
			{
				error:
					"Aucun en-tête reconnu. Assurez-vous d'utiliser le modèle fourni.",
			},
			{ status: 400 },
		);
	}

	const rows: Record<string, string>[] = [];
	let skippedEmpty = 0;

	sheet.eachRow((row, rowIndex) => {
		if (rowIndex === 1) return;

		const parsed: Record<string, string> = {};
		let hasValue = false;

		row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
			const key = colMap[colIndex];
			if (!key) return;
			const val = cellToString(cell).trim();
			parsed[key] = val;
			if (val) hasValue = true;
		});

		// Compléter les clés manquantes (colonnes vides non itérées)
		for (const key of Object.values(colMap)) {
			if (!(key in parsed)) parsed[key] = "";
		}

		if (!hasValue) {
			skippedEmpty++;
			return;
		}

		rows.push(parsed);
	});

	return NextResponse.json({
		category: {
			id: category.id,
			name: category.name,
			customFields,
		},
		rows,
		skippedEmpty,
	});
}
