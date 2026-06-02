import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import ExcelJS from "exceljs";
import type { MapCategory } from "../../../../payload/payload-types";

// ExcelJS type declarations don't expose dataValidations on Worksheet — cast needed.
type SheetWithValidations = ExcelJS.Worksheet & {
	dataValidations: {
		add(
			address: string,
			rule: {
				type: string;
				allowBlank?: boolean;
				formulae?: string[];
				showErrorMessage?: boolean;
				errorStyle?: string;
				errorTitle?: string;
				error?: string;
				showInputMessage?: boolean;
				promptTitle?: string;
				prompt?: string;
			},
		): void;
	};
};

type CustomField = NonNullable<MapCategory["customFields"]>[number];

const COLOR_HEADER_BASE = "1F3A5F";
const COLOR_HEADER_CUSTOM = "0D6E4B";
const COLOR_WHITE = "FFFFFFFF";
const COLOR_ROW_BASE = "EBF5FB";
const COLOR_ROW_CUSTOM = "EAFAF1";

function colLetter(n: number): string {
	let result = "";
	let i = n;
	while (i > 0) {
		const rem = (i - 1) % 26;
		result = String.fromCharCode(65 + rem) + result;
		i = Math.floor((i - 1) / 26);
	}
	return result;
}

async function buildTemplate(category: MapCategory): Promise<Buffer> {
	const { name, slug, customFields = [] } = category;

	const workbook = new ExcelJS.Workbook();
	workbook.creator = "Maison de l'autisme";

	// ── Feuille 1 : Points ───────────────────────────────────────
	const rawSheet = workbook.addWorksheet("Points", {
		views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
		pageSetup: { fitToPage: true, fitToWidth: 1 },
	});
	const sheet = rawSheet as SheetWithValidations;

	type ColDef = {
		header: string;
		key: string;
		width: number;
		note: string;
		isCustom?: boolean;
		field?: CustomField;
	};

	const baseColumns: ColDef[] = [
		{
			header: "Nom *",
			key: "nom",
			width: 32,
			note: "Requis. Nom affiché sur la carte.",
		},
		{
			header: "Adresse *",
			key: "adresse",
			width: 42,
			note: "Requis. Adresse postale complète. Sert au géocodage automatique.",
		},
		{
			header: "Code Postal",
			key: "codePostal",
			width: 14,
			note: "Optionnel. Ex. : 75001",
		},
		{
			header: "Ville *",
			key: "ville",
			width: 26,
			note: "Requis. Nom de la commune.",
		},
		{
			header: "Téléphone",
			key: "telephone",
			width: 20,
			note: "Optionnel. Numéro de téléphone.",
		},
		{
			header: "Email",
			key: "email",
			width: 32,
			note: "Optionnel. Adresse e-mail de contact.",
		},
		{
			header: "Site Web",
			key: "siteWeb",
			width: 42,
			note: "Optionnel. Doit commencer par http:// ou https://",
		},
		{
			header: "Description",
			key: "description",
			width: 52,
			note: "Optionnel. Texte affiché dans la bulle d'information sur la carte.",
		},
	];

	const customColumns: ColDef[] = (customFields ?? []).map((f) => ({
		header: f.label,
		key: f.key,
		width: 24,
		isCustom: true,
		field: f,
		note:
			f.type === "checkbox"
				? "Valeurs autorisées : Oui, Non, NC\n(NC = Non Renseigné)"
				: f.type === "select" && f.options?.length
					? `Valeurs autorisées : ${f.options.map((o) => o.value).join(", ")}`
					: "Texte libre.",
	}));

	const allColumns = [...baseColumns, ...customColumns];

	sheet.columns = allColumns.map((c) => ({ key: c.key, width: c.width }));

	// Ligne d'en-tête
	const headerRow = sheet.addRow(allColumns.map((c) => c.header));
	headerRow.height = 30;
	headerRow.eachCell((cell, colNum) => {
		const isCustom = colNum > baseColumns.length;
		cell.font = { bold: true, color: { argb: COLOR_WHITE }, size: 10 };
		cell.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: isCustom ? COLOR_HEADER_CUSTOM : COLOR_HEADER_BASE },
		};
		cell.alignment = {
			vertical: "middle",
			horizontal: "center",
			wrapText: true,
		};
		cell.border = {
			right: { style: "thin", color: { argb: "40FFFFFF" } },
		};
	});

	// Notes sur les en-têtes (info-bulle au survol)
	allColumns.forEach((col, i) => {
		const cell = sheet.getRow(1).getCell(i + 1);
		cell.note = { texts: [{ text: col.note }], editAs: "oneCells" };
	});

	// Validations de données pour les champs personnalisés (lignes 2–501)
	allColumns.forEach((col, i) => {
		if (!col.isCustom || !col.field) return;
		const range = `${colLetter(i + 1)}2:${colLetter(i + 1)}501`;
		const f = col.field;

		if (f.type === "checkbox") {
			sheet.dataValidations.add(range, {
				type: "list",
				allowBlank: true,
				formulae: ['"Oui,Non,NC"'],
				showErrorMessage: true,
				errorStyle: "stop",
				errorTitle: "Valeur non autorisée",
				error: "Choisissez parmi : Oui, Non, NC",
				showInputMessage: true,
				promptTitle: f.label,
				prompt: "Saisissez Oui, Non ou NC (Non Renseigné).",
			});
		} else if (f.type === "select" && f.options?.length) {
			const opts = f.options.map((o) => o.value).join(",");
			sheet.dataValidations.add(range, {
				type: "list",
				allowBlank: true,
				formulae: [`"${opts}"`],
				showErrorMessage: true,
				errorStyle: "stop",
				errorTitle: "Valeur non autorisée",
				error: `Choisissez parmi : ${opts}`,
				showInputMessage: true,
				promptTitle: f.label,
				prompt: `Valeurs autorisées : ${opts}`,
			});
		}
	});

	// ── Feuille 2 : Instructions ──────────────────────────────────
	const instr = workbook.addWorksheet("Instructions");
	instr.columns = [
		{ key: "col", width: 26 },
		{ key: "req", width: 12 },
		{ key: "desc", width: 68 },
	];

	const titleRow = instr.addRow([`Modèle d'import — ${name}`, "", ""]);
	titleRow.height = 28;
	titleRow.getCell(1).font = {
		bold: true,
		size: 14,
		color: { argb: COLOR_HEADER_BASE },
	};
	titleRow.getCell(1).alignment = { vertical: "middle" };
	instr.mergeCells("A1:C1");

	instr.addRow([
		"Remplissez la feuille « Points » puis importez le fichier depuis l'administration.",
		"",
		"",
	]);
	instr.getRow(2).getCell(1).font = {
		italic: true,
		color: { argb: "666666" },
		size: 10,
	};
	instr.mergeCells("A2:C2");

	instr.addRow([]);

	const thRow = instr.addRow([
		"Colonne",
		"Obligatoire",
		"Description / Valeurs autorisées",
	]);
	thRow.height = 24;
	thRow.eachCell((cell) => {
		cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
		cell.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: COLOR_HEADER_BASE },
		};
		cell.alignment = { vertical: "middle" };
	});

	const instrBase: [string, string, string][] = [
		["Nom", "Oui", "Nom du point affiché sur la carte."],
		[
			"Adresse",
			"Oui",
			"Adresse postale complète. Utilisée pour calculer automatiquement les coordonnées GPS.",
		],
		["Code Postal", "Non", "Ex. : 75001. Sert aux filtres région/département."],
		["Ville", "Oui", "Nom de la commune."],
		["Téléphone", "Non", "Numéro de téléphone de contact."],
		["Email", "Non", "Adresse e-mail de contact."],
		[
			"Site Web",
			"Non",
			"URL du site web. Doit commencer par http:// ou https://",
		],
		[
			"Description",
			"Non",
			"Texte affiché dans la bulle d'information sur la carte.",
		],
	];

	instrBase.forEach((data, i) => {
		const row = instr.addRow(data);
		row.getCell(2).alignment = { horizontal: "center" };
		if (i % 2 === 0) {
			row.eachCell({ includeEmpty: true }, (cell) => {
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: COLOR_ROW_BASE },
				};
			});
		}
	});

	if (customFields && customFields.length > 0) {
		instr.addRow([]);
		const customTitleRow = instr.addRow(["Champs personnalisés", "", ""]);
		customTitleRow.getCell(1).font = {
			bold: true,
			color: { argb: COLOR_HEADER_CUSTOM },
		};
		instr.mergeCells(`A${customTitleRow.number}:C${customTitleRow.number}`);

		customFields.forEach((f, i) => {
			let desc = "";
			if (f.type === "checkbox") {
				desc =
					"Valeurs autorisées : Oui, Non, NC  (NC = Non Renseigné). Menu déroulant disponible dans la colonne.";
			} else if (f.type === "select" && f.options?.length) {
				const opts = f.options
					.map((o) =>
						o.label !== o.value ? `${o.value} (${o.label})` : o.value,
					)
					.join(", ");
				desc = `Valeurs autorisées : ${opts}. Menu déroulant disponible.`;
			} else {
				desc = "Texte libre.";
			}
			const row = instr.addRow([f.label, "Non", desc]);
			row.getCell(2).alignment = { horizontal: "center" };
			if (i % 2 === 0) {
				row.eachCell({ includeEmpty: true }, (cell) => {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: COLOR_ROW_CUSTOM },
					};
				});
			}
		});
	}

	instr.addRow([]);
	const noteRow = instr.addRow([
		"ℹ La géolocalisation est calculée automatiquement depuis l'adresse lors de l'import.",
		"",
		"",
	]);
	noteRow.getCell(1).font = {
		italic: true,
		color: { argb: "555555" },
		size: 10,
	};
	instr.mergeCells(`A${noteRow.number}:C${noteRow.number}`);

	const buffer = await workbook.xlsx.writeBuffer();
	return Buffer.from(buffer);
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const categoryId = searchParams.get("categoryId");

	if (!categoryId) {
		return NextResponse.json({ error: "categoryId requis" }, { status: 400 });
	}

	const payload = await getPayload({ config: configPromise });

	const { user } = await payload.auth({ headers: req.headers });
	if (!user) {
		return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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

	const buffer = await buildTemplate(category);

	return new NextResponse(buffer, {
		headers: {
			"Content-Type":
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"Content-Disposition": `attachment; filename="modele-import-${category.slug}.xlsx"`,
		},
	});
}
