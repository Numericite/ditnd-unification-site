"use client";

import { Banner, Button, Drawer, Pill, toast, useModal } from "@payloadcms/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { CoursesImportReport } from "../import/coursesImportTypes";
import styles from "./CoursesImport.module.css";

const DRAWER_SLUG = "courses-import-report";

export default function CoursesImport() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);
	const [report, setReport] = useState<CoursesImportReport | null>(null);
	const { openModal } = useModal();
	const router = useRouter();

	const handleFiles = async (files: FileList | null) => {
		if (!files?.length) return;
		setLoading(true);
		const body = new FormData();
		for (const file of Array.from(files)) body.append("files", file);

		try {
			const res = await fetch("/api/courses-import", {
				method: "POST",
				body,
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error ?? "L'import a échoué.");
				return;
			}
			setReport(data as CoursesImportReport);
			openModal(DRAWER_SLUG);
			router.refresh();
		} catch {
			toast.error("L'import a échoué.");
		} finally {
			setLoading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	};

	return (
		<>
			<div className={styles.bar}>
				<span className={styles.hint}>
					Ajoutez des formations depuis un ou plusieurs fichiers JSON. Elles
					sont créées en brouillon.
				</span>
				<input
					ref={inputRef}
					type="file"
					accept=".json,application/json"
					multiple
					hidden
					onChange={(e) => handleFiles(e.target.files)}
				/>
				<Button
					buttonStyle="primary"
					size="small"
					margin={false}
					disabled={loading}
					onClick={() => inputRef.current?.click()}
				>
					{loading ? "Import en cours…" : "Importer"}
				</Button>
			</div>

			<Drawer slug={DRAWER_SLUG} title="Récapitulatif de l'import">
				{report && <ImportReport report={report} />}
			</Drawer>
		</>
	);
}

const plural = (n: number, singular: string, pluralForm: string) =>
	`${n} ${n > 1 ? pluralForm : singular}`;

function ImportReport({ report }: { report: CoursesImportReport }) {
	const { imported, rejected } = report;

	return (
		<div className={styles.report}>
			<p className={styles.summary}>
				{plural(imported.length, "formation importée", "formations importées")}{" "}
				en brouillon
				{rejected.length > 0 &&
					`, ${plural(rejected.length, "non importée", "non importées")}`}
				.
			</p>

			{imported.length > 0 && (
				<section>
					<h3>Formations importées</h3>
					<div className={styles.tableWrapper}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>Titre</th>
									<th>Champs remplis</th>
									<th>Champs à compléter</th>
								</tr>
							</thead>
							<tbody>
								{imported.map((course) => (
									<tr key={course.id}>
										<td>
											<Link
												href={`/admin/collections/courses/${course.id}`}
												className={styles.link}
											>
												{course.title}
											</Link>
										</td>
										<td>{course.filled.join(", ")}</td>
										<td>
											{course.missingRequired.length > 0 ? (
												<div className={styles.pills}>
													{course.missingRequired.map((label) => (
														<Pill key={label} size="small" pillStyle="warning">
															{label}
														</Pill>
													))}
												</div>
											) : (
												<span className={styles.ok}>Prête à publier</span>
											)}
											{course.missingOptional.length > 0 && (
												<p className={styles.optional}>
													Facultatifs non renseignés :{" "}
													{course.missingOptional.join(", ")}
												</p>
											)}
											{course.warnings.length > 0 && (
												<ul className={styles.warnings}>
													{course.warnings.map((w) => (
														<li key={w}>{w}</li>
													))}
												</ul>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			)}

			{rejected.length > 0 && (
				<section>
					<h3>Non importées</h3>
					<Banner type="error">
						Ces formations n'ont pas été créées. Les autres ont été importées
						normalement.
					</Banner>
					<div className={styles.tableWrapper}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>Titre</th>
									<th>Origine</th>
									<th>Motif</th>
								</tr>
							</thead>
							<tbody>
								{rejected.map((item, i) => (
									<tr key={`${item.source}-${i}`}>
										<td>{item.title ?? <em>Sans titre</em>}</td>
										<td>{item.source}</td>
										<td>{item.reason}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			)}
		</div>
	);
}
