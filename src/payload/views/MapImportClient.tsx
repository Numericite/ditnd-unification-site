"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import styles from "./MapImportClient.module.css";
import {
	Banner,
	Button,
	FieldLabel,
	Gutter,
	Pagination,
	Pill,
} from "@payloadcms/ui";

type CustomField = {
	id?: string | null;
	label: string;
	key: string;
	type: "checkbox" | "text" | "select";
	options?: Array<{ label: string; value: string; id?: string | null }> | null;
};

type CategoryInfo = {
	id: number;
	name: string;
	customFields: CustomField[];
};

type ParsedRow = Record<string, string> & { _id: string };

type ImportResult = {
	total: number;
	created: number;
	failed: number;
	errors: Array<{ rowIndex: number; error: string }>;
};

type Step = "upload" | "review" | "importing" | "done";

const BASE_COLS = [
	{ key: "nom", label: "Nom", required: true, width: 160 },
	{ key: "adresse", label: "Adresse", required: true, width: 240 },
	{ key: "codePostal", label: "Code Postal", required: false, width: 100 },
	{ key: "ville", label: "Ville", required: true, width: 140 },
	{ key: "telephone", label: "Téléphone", required: false, width: 130 },
	{ key: "email", label: "Email", required: false, width: 180 },
	{ key: "siteWeb", label: "Site Web", required: false, width: 200 },
	{ key: "description", label: "Description", required: false, width: 200 },
] as const;

const PAGE_SIZE = 25;

let _counter = 0;
const uid = () => `r${++_counter}`;

function rowErrors(row: ParsedRow, category?: CategoryInfo | null): string[] {
	const errs: string[] = [];
	if (!row.nom?.trim()) errs.push("Nom requis");
	if (!row.adresse?.trim()) errs.push("Adresse requise");
	if (!row.ville?.trim()) errs.push("Ville requise");
	for (const f of category?.customFields ?? []) {
		if (f.type === "checkbox" && !(row[f.key] ?? "").trim()) {
			errs.push(`${f.label} requis`);
		}
	}
	return errs;
}

export default function MapImportClient() {
	const [step, setStep] = useState<Step>("upload");

	const [categories, setCategories] = useState<
		Array<{ id: number; name: string }>
	>([]);
	const [catId, setCatId] = useState("");
	const [parseError, setParseError] = useState("");
	const [parsing, setParsing] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const [category, setCategory] = useState<CategoryInfo | null>(null);
	const [rows, setRows] = useState<ParsedRow[]>([]);
	const [page, setPage] = useState(0);
	const [onlyErrors, setOnlyErrors] = useState(false);

	const [result, setResult] = useState<ImportResult | null>(null);

	useEffect(() => {
		fetch("/api/map-categories?limit=100&sort=name")
			.then((r) => r.json())
			.then((d) => setCategories(d.docs ?? []))
			.catch(() => {});
	}, []);

	const handleParse = useCallback(async () => {
		const file = fileRef.current?.files?.[0];
		if (!file || !catId) return;
		setParsing(true);
		setParseError("");

		const fd = new FormData();
		fd.append("categoryId", catId);
		fd.append("file", file);

		const res = await fetch("/api/map-markers-import-parse", {
			method: "POST",
			body: fd,
		});
		const data = await res.json();
		setParsing(false);

		if (!res.ok) {
			setParseError(data.error ?? "Erreur lors de l'analyse");
			return;
		}

		const customKeys =
			(data.category.customFields as CustomField[]).map((f) => f.key) ?? [];

		setCategory(data.category);
		setRows(
			(data.rows as Record<string, string>[]).map((r) => ({
				_id: uid(),
				nom: r.nom ?? "",
				adresse: r.adresse ?? "",
				codePostal: r.codePostal ?? "",
				ville: r.ville ?? "",
				telephone: r.telephone ?? "",
				email: r.email ?? "",
				siteWeb: r.siteWeb ?? "",
				description: r.description ?? "",
				...Object.fromEntries(customKeys.map((k) => [k, r[k] ?? ""])),
			})),
		);
		setPage(0);
		setOnlyErrors(false);
		setStep("review");
	}, [catId]);

	const updateCell = useCallback((id: string, key: string, val: string) => {
		setRows((prev) =>
			prev.map((r) => (r._id === id ? { ...r, [key]: val } : r)),
		);
	}, []);

	const deleteRow = useCallback((id: string) => {
		setRows((prev) => prev.filter((r) => r._id !== id));
	}, []);

	const handleImport = useCallback(async () => {
		if (!category) return;
		setStep("importing");

		const cleanRows = rows.map(({ _id, ...rest }) => rest);

		const res = await fetch("/api/map-markers-import-commit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				categoryId: catId,
				rows: cleanRows,
				customFields: category.customFields,
			}),
		});
		const data = await res.json();
		setResult(data);
		setStep("done");
	}, [category, rows, catId]);

	const reset = useCallback(() => {
		setStep("upload");
		setCategory(null);
		setRows([]);
		setResult(null);
		setParseError("");
		if (fileRef.current) fileRef.current.value = "";
	}, []);

	const allCols = [
		...BASE_COLS,
		...(category?.customFields ?? []).map((f) => ({
			key: f.key,
			label: f.label,
			required: false as const,
			width: 160,
			fieldDef: f,
		})),
	];

	const rowsWithErr = rows.map((r) => ({
		...r,
		_errs: rowErrors(r, category),
	}));
	const errorCount = rowsWithErr.filter((r) => r._errs.length > 0).length;

	useEffect(() => {
		if (onlyErrors && errorCount === 0) setOnlyErrors(false);
	}, [errorCount, onlyErrors]);
	const displayed = onlyErrors
		? rowsWithErr.filter((r) => r._errs.length > 0)
		: rowsWithErr;
	const totalPages = Math.ceil(displayed.length / PAGE_SIZE);
	const pageSlice = displayed.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

	if (step === "importing") {
		return (
			<Gutter>
				<div style={{ paddingTop: "calc(var(--base) * 2)" }}>
					<h1>Import en cours…</h1>
					<p
						style={{
							color: "var(--theme-elevation-500)",
							marginTop: "var(--base)",
						}}
					>
						Création des points et géocodage des adresses en cours. Veuillez
						patienter.
					</p>
				</div>
			</Gutter>
		);
	}

	if (step === "done" && result) {
		const allOk = result.failed === 0;
		return (
			<Gutter>
				<div style={{ paddingTop: "calc(var(--base) * 2)" }}>
					<h1>Import terminé</h1>

					<div style={{ marginTop: "var(--base)" }}>
						<Banner type={allOk ? "success" : "default"}>
							<strong>{result.created}</strong> point
							{result.created !== 1 ? "s" : ""} créé
							{result.created !== 1 ? "s" : ""}
							{result.failed > 0 && (
								<>
									{" "}
									· <strong>{result.failed}</strong> en erreur
								</>
							)}{" "}
							sur {result.total}
						</Banner>
					</div>

					{result.errors.length > 0 && (
						<details style={{ marginTop: "var(--base)" }}>
							<summary
								style={{
									cursor: "pointer",
									fontSize: "0.85rem",
									color: "var(--theme-error-500)",
								}}
							>
								Voir les erreurs ({result.errors.length})
							</summary>
							<ul
								style={{
									marginTop: "calc(var(--base) * 0.5)",
									fontSize: "0.8rem",
									paddingLeft: "calc(var(--base) * 1.5)",
								}}
							>
								{result.errors.map((e, i) => (
									<li key={i}>
										Ligne {e.rowIndex + 1} : {e.error}
									</li>
								))}
							</ul>
						</details>
					)}

					<div
						style={{
							marginTop: "calc(var(--base) * 1.5)",
							display: "flex",
							gap: "calc(var(--base) * 0.75)",
						}}
					>
						<Button buttonStyle="primary" onClick={reset} type="button">
							Importer d&apos;autres points
						</Button>
						<Button
							buttonStyle="secondary"
							el="anchor"
							url="/admin/collections/map-markers"
						>
							Voir les points de carte →
						</Button>
					</div>
				</div>
			</Gutter>
		);
	}

	return (
		<Gutter>
			<div
				style={{
					paddingTop: "calc(var(--base) * 2)",
					paddingBottom: "calc(var(--base) * 4)",
				}}
			>
				<h1>Importer des points de carte</h1>
				<p
					style={{
						color: "var(--theme-elevation-500)",
						marginTop: "calc(var(--base) * 0.25)",
						marginBottom: "calc(var(--base) * 2)",
					}}
				>
					Importez des marqueurs en masse depuis un fichier Excel. Vérifiez et
					modifiez les données avant de les ajouter en base.
				</p>

				{step === "upload" && (
					<div className="render-fields" style={{ maxWidth: 540 }}>
						<div className="field-type text">
							<div className="field-type__wrap">
								<FieldLabel
									htmlFor="map-import-category"
									label="Catégorie de destination"
									required
								/>
								<select
									id="map-import-category"
									value={catId}
									onChange={(e) => setCatId(e.target.value)}
									style={{
										width: "100%",
										height: "calc(var(--base) * 2)",
										padding: "0 calc(var(--base) * 0.5)",
										border: "1px solid var(--theme-elevation-150)",
										borderRadius: "var(--style-radius-s)",
										background: "var(--theme-input-bg)",
										color: "var(--theme-elevation-800)",
										fontSize: "1rem",
										fontFamily: "var(--font-body)",
										boxShadow: "0 2px 2px -1px rgba(0,0,0,.1)",
									}}
								>
									<option value="">— Choisir une catégorie —</option>
									{categories.map((c) => (
										<option key={c.id} value={String(c.id)}>
											{c.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="field-type text">
							<div className="field-type__wrap">
								<FieldLabel
									htmlFor="map-import-file"
									label="Fichier Excel (.xlsx)"
								/>
								<input
									id="map-import-file"
									ref={fileRef}
									type="file"
									accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
									style={{ display: "block" }}
								/>
								<p className="field-description">
									Utilisez le modèle téléchargeable depuis la page de la
									catégorie (bouton «&nbsp;Télécharger le modèle Excel&nbsp;»).
								</p>
							</div>
						</div>

						{parseError && (
							<div style={{ marginBottom: "var(--base)" }}>
								<Banner type="error">{parseError}</Banner>
							</div>
						)}

						<Button
							buttonStyle="primary"
							disabled={!catId || parsing}
							onClick={handleParse}
							type="button"
						>
							{parsing ? "Analyse en cours…" : "Analyser le fichier"}
						</Button>
					</div>
				)}

				{step === "review" && category && (
					<>
						<div className={styles.toolbar}>
							<span className={styles.toolbarCount}>
								<strong>{rows.length}</strong> ligne
								{rows.length !== 1 ? "s" : ""} chargée
								{rows.length !== 1 ? "s" : ""}
							</span>

							{errorCount > 0 && (
								<Pill pillStyle="error" size="small">
									{errorCount} erreur{errorCount !== 1 ? "s" : ""}
								</Pill>
							)}

							{errorCount > 0 && (
								<Button
									buttonStyle="pill"
									size="small"
									onClick={() => {
										setOnlyErrors((v) => !v);
										setPage(0);
									}}
									type="button"
								>
									{onlyErrors
										? "Voir toutes les lignes"
										: "Voir uniquement les erreurs"}
								</Button>
							)}

							<div className={styles.toolbarActions}>
								<Button buttonStyle="secondary" onClick={reset} type="button">
									Recommencer
								</Button>
								<Button
									buttonStyle="primary"
									disabled={errorCount > 0 || rows.length === 0}
									onClick={handleImport}
									tooltip={
										errorCount > 0
											? "Corrigez les erreurs avant d'importer"
											: undefined
									}
									type="button"
								>
									{errorCount > 0
										? "Corriger les erreurs"
										: `Importer ${rows.length} point${rows.length !== 1 ? "s" : ""} →`}
								</Button>
							</div>
						</div>

						<div className={styles.reviewTable}>
							<table>
								<thead>
									<tr>
										<th style={{ width: 32 }}>#</th>
										{allCols.map((col) => (
											<th key={col.key} style={{ minWidth: col.width }}>
												{col.label}
												{col.required ? (
													<span
														style={{
															color: "var(--theme-error-500)",
															marginLeft: 2,
														}}
													>
														*
													</span>
												) : null}
											</th>
										))}
										<th style={{ width: 32 }} />
									</tr>
								</thead>
								<tbody>
									{pageSlice.map((row, pi) => {
										const gi = page * PAGE_SIZE + pi;
										const hasErr = row._errs.length > 0;
										return (
											<tr
												key={row._id}
												className={hasErr ? styles.rowError : undefined}
											>
												<td className={styles.tdIndex}>{gi + 1}</td>

												{allCols.map((col) => {
													const val =
														(row as unknown as Record<string, string>)[
															col.key
														] ?? "";
													const isErr = col.required && !val.trim();
													const fd =
														"fieldDef" in col
															? (
																	col as typeof col & {
																		fieldDef: CustomField;
																	}
																).fieldDef
															: undefined;

													if (fd?.type === "checkbox") {
														const isCheckboxErr = !val;
														return (
															<td key={col.key}>
																<select
																	value={val}
																	onChange={(e) =>
																		updateCell(row._id, col.key, e.target.value)
																	}
																	className={
																		isCheckboxErr
																			? `${styles.cellSelect} ${styles.selectError}`
																			: styles.cellSelect
																	}
																>
																	<option value="" disabled hidden />
																	<option value="Oui">Oui</option>
																	<option value="Non">Non</option>
																	<option value="NC">NC</option>
																</select>
															</td>
														);
													}

													if (fd?.type === "select" && fd.options?.length) {
														return (
															<td key={col.key}>
																<select
																	value={val}
																	onChange={(e) =>
																		updateCell(row._id, col.key, e.target.value)
																	}
																	className={styles.cellSelect}
																>
																	<option value="" />
																	{fd.options.map((o) => (
																		<option key={o.value} value={o.value}>
																			{o.label}
																		</option>
																	))}
																</select>
															</td>
														);
													}

													return (
														<td key={col.key}>
															<input
																type="text"
																value={val}
																onChange={(e) =>
																	updateCell(row._id, col.key, e.target.value)
																}
																className={
																	isErr
																		? `${styles.cellInput} ${styles.inputError}`
																		: styles.cellInput
																}
																style={{
																	minWidth: col.width - 20,
																}}
																title={
																	isErr ? "Ce champ est requis" : undefined
																}
															/>
														</td>
													);
												})}

												<td className={styles.tdAction}>
													<Button
														buttonStyle="error"
														size="large"
														onClick={() => deleteRow(row._id)}
														type="button"
													>
														×
													</Button>
												</td>
											</tr>
										);
									})}

									{pageSlice.length === 0 && (
										<tr>
											<td
												colSpan={allCols.length + 2}
												style={{
													textAlign: "center",
													padding: "calc(var(--base) * 2)",
													color: "var(--theme-elevation-400)",
												}}
											>
												{onlyErrors
													? "Aucune ligne avec erreur"
													: "Aucune ligne"}
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{totalPages > 1 && (
							<Pagination
								hasNextPage={page < totalPages - 1}
								hasPrevPage={page > 0}
								nextPage={page + 2}
								onChange={(newPage) => setPage(newPage - 1)}
								page={page + 1}
								prevPage={page}
								totalPages={totalPages}
							/>
						)}
					</>
				)}
			</div>
		</Gutter>
	);
}
