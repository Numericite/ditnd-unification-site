"use client";

import {
	Banner,
	Button,
	Form,
	Gutter,
	RenderFields,
	useConfig,
	useFormFields,
	useServerFunctions,
} from "@payloadcms/ui";
import type { FormState } from "payload";
import SparklesIcon from "../components/SparklesIcon";
import {
	type MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { lexicalToMarkdown } from "../services/lexicalToMarkdown";
import { markdownToLexical } from "../services/markdownToLexical";
import styles from "./SimplifiedContentGeneratorClient.module.css";
import {
	exportAsDocx,
	exportAsMarkdown,
	exportAsPdf,
} from "./simplifiedContentExports";
import {
	GENERATOR_GLOBAL_SLUG,
	generatorDocPermissions,
} from "./simplifiedContentGeneratorShared";

type ExportFormat = "pdf" | "docx" | "md";
type Step = 1 | 2;

// Mirrors the source editor value into a ref so the generate/regenerate
// actions can read it from outside the Form provider.
function SourceValueBridge({
	valueRef,
}: {
	valueRef: MutableRefObject<unknown>;
}) {
	const sourceValue = useFormFields(([fields]) => fields.source?.value);
	useEffect(() => {
		valueRef.current = sourceValue;
	}, [sourceValue, valueRef]);
	return null;
}

function GenerationLoader() {
	return (
		<output className={styles.loadingBox}>
			<span className={styles.spinnerLarge} aria-hidden />
			<p className={styles.loadingTitle}>
				Génération du contenu simplifié en cours…
			</p>
			<p className={styles.loadingHint}>
				L'appel au modèle peut prendre jusqu'à une minute.
			</p>
		</output>
	);
}

function ExportActions({
	title,
	exporting,
	onExport,
}: {
	title: string;
	exporting: ExportFormat | null;
	onExport: (
		format: ExportFormat,
		title: string,
		resultLexical: unknown,
	) => void;
}) {
	const resultValue = useFormFields(([fields]) => fields.result?.value);

	const buttons: { format: ExportFormat; label: string }[] = [
		{ format: "pdf", label: "Télécharger en PDF" },
		{ format: "docx", label: "Télécharger en DOCX" },
		{ format: "md", label: "Télécharger en Markdown" },
	];

	return (
		<div className={styles.exportRow}>
			{buttons.map(({ format, label }) => (
				<Button
					key={format}
					onClick={() => onExport(format, title, resultValue)}
					disabled={exporting !== null}
				>
					{exporting === format ? "Export…" : label}
				</Button>
			))}
		</div>
	);
}

export default function SimplifiedContentGeneratorClient({
	initialState,
}: {
	initialState: FormState;
}) {
	const { getEntityConfig } = useConfig();
	const { getFormState } = useServerFunctions();
	const globalConfig = getEntityConfig({ globalSlug: GENERATOR_GLOBAL_SLUG });

	const sourceFields = useMemo(
		() => globalConfig.fields.filter((f) => "name" in f && f.name === "source"),
		[globalConfig],
	);
	const resultFields = useMemo(
		() => globalConfig.fields.filter((f) => "name" in f && f.name === "result"),
		[globalConfig],
	);

	const sourceValueRef = useRef<unknown>(null);

	const [step, setStep] = useState<Step>(1);
	const [title, setTitle] = useState("");
	const [generating, setGenerating] = useState(false);
	const [hasResult, setHasResult] = useState(false);
	const [error, setError] = useState("");
	const [exporting, setExporting] = useState<ExportFormat | null>(null);
	const [resultState, setResultState] = useState<FormState | null>(null);
	const [resultVersion, setResultVersion] = useState(0);

	const goToStep = useCallback((next: Step) => {
		setStep(next);
		setError("");
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const handleGenerate = useCallback(async () => {
		const sourceMarkdown = lexicalToMarkdown(sourceValueRef.current);
		if (!sourceMarkdown.trim()) {
			setError("Rédigez d'abord le contenu à simplifier.");
			return;
		}

		setGenerating(true);
		setError("");

		try {
			const res = await fetch("/api/simplified-content-generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ markdown: sourceMarkdown }),
			});
			const data = (await res.json()) as {
				markdown?: string;
				error?: string;
			};

			if (!res.ok || typeof data.markdown !== "string") {
				setError(data.error ?? "La génération a échoué. Veuillez réessayer.");
				return;
			}

			const resultLexical = markdownToLexical(data.markdown);
			const response = await getFormState({
				globalSlug: GENERATOR_GLOBAL_SLUG,
				docPermissions: generatorDocPermissions,
				docPreferences: { fields: {} },
				formState: {
					result: {
						initialValue: resultLexical,
						valid: true,
						value: resultLexical,
					},
				},
				operation: "update",
				renderAllFields: true,
				schemaPath: GENERATOR_GLOBAL_SLUG,
				skipValidation: true,
			});

			if (!response?.state) {
				setError("La génération a échoué. Veuillez réessayer.");
				return;
			}

			setResultState(response.state);
			setResultVersion((version) => version + 1);
			setHasResult(true);
			setStep(2);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch {
			setError("La génération a échoué. Veuillez réessayer.");
		} finally {
			setGenerating(false);
		}
	}, [getFormState]);

	const handleExport = useCallback(
		async (format: ExportFormat, docTitle: string, resultLexical: unknown) => {
			const markdown = lexicalToMarkdown(resultLexical);
			if (!markdown.trim()) return;

			setExporting(format);
			setError("");
			try {
				if (format === "md") {
					exportAsMarkdown(docTitle, markdown);
				} else if (format === "docx") {
					await exportAsDocx(docTitle, markdown);
				} else {
					await exportAsPdf(docTitle, markdown);
				}
			} catch {
				setError("L'export a échoué. Veuillez réessayer.");
			} finally {
				setExporting(null);
			}
		},
		[],
	);

	const steps: { index: Step; label: string; description: string }[] = [
		{
			index: 1,
			label: "Rédigez votre contenu",
			description: "Saisissez ou collez le texte à simplifier",
		},
		{
			index: 2,
			label: "Relisez et téléchargez",
			description: "Ajustez la version simplifiée puis exportez-la",
		},
	];

	return (
		<Gutter className="simplified-content-generator">
			<h1 className={styles.pageTitle}>Générateur de contenu simplifié</h1>
			<p className={styles.pageIntro}>
				Transformez un contenu en version simplifiée, plus facile à lire et à
				comprendre, puis téléchargez-la en PDF, DOCX ou Markdown.
			</p>

			<ol className={styles.stepper}>
				{steps.map(({ index, label, description }) => {
					const isActive = step === index;
					const isDone = index === 1 && step === 2;
					const isReachable = index === 1 || hasResult;
					return (
						<li key={index} className={styles.stepItem}>
							<button
								type="button"
								className={[
									styles.stepButton,
									isActive ? styles.stepActive : "",
									isDone ? styles.stepDone : "",
								].join(" ")}
								onClick={() => goToStep(index)}
								disabled={!isReachable || generating}
								aria-current={isActive ? "step" : undefined}
							>
								<span className={styles.stepIndex} aria-hidden>
									{isDone ? "✓" : index}
								</span>
								<span className={styles.stepText}>
									<span className={styles.stepLabel}>{label}</span>
									<span className={styles.stepDescription}>{description}</span>
								</span>
							</button>
							{index < steps.length && (
								<span className={styles.stepConnector} aria-hidden />
							)}
						</li>
					);
				})}
			</ol>

			{error && (
				<div className={styles.errorBanner}>
					<Banner type="error">{error}</Banner>
				</div>
			)}

			<section className={step === 1 ? styles.stepPanel : styles.hidden}>
				<div className={generating ? styles.hidden : styles.titleField}>
					<label className={styles.titleLabel} htmlFor="generator-title">
						Titre du document
					</label>
					<input
						id="generator-title"
						type="text"
						className={styles.titleInput}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Ex. : Faire une demande d'AEEH"
						aria-describedby="generator-title-hint"
					/>
					<p id="generator-title-hint" className={styles.fieldHint}>
						Utilisé comme titre et comme nom des fichiers téléchargés.
					</p>
				</div>
				<Form initialState={initialState}>
					<SourceValueBridge valueRef={sourceValueRef} />
					<div className={generating ? styles.hidden : ""}>
						<RenderFields
							fields={sourceFields}
							forceRender
							parentIndexPath=""
							parentPath=""
							parentSchemaPath={GENERATOR_GLOBAL_SLUG}
							permissions={true}
							readOnly={false}
						/>
					</div>
				</Form>
				{generating && <GenerationLoader />}
				<div className={styles.actionBar}>
					<Button
						className={styles.actionRight}
						onClick={handleGenerate}
						disabled={generating}
						icon={<SparklesIcon />}
						iconPosition="left"
					>
						{generating
							? "Génération en cours…"
							: "Générer le contenu simplifié"}
					</Button>
				</div>
			</section>

			<section className={step === 2 ? styles.stepPanel : styles.hidden}>
				<div className={styles.successBanner}>
					<Banner type="success">
						Contenu simplifié généré. Relisez-le, ajustez-le si besoin, puis
						téléchargez-le au format de votre choix.
					</Banner>
				</div>
				{title.trim() && <h2 className={styles.resultTitle}>{title}</h2>}
				<Form key={resultVersion} initialState={resultState ?? initialState}>
					<RenderFields
						fields={resultFields}
						forceRender
						parentIndexPath=""
						parentPath=""
						parentSchemaPath={GENERATOR_GLOBAL_SLUG}
						permissions={true}
						readOnly={false}
					/>
					<div className={styles.actionBar}>
						<ExportActions
							title={title}
							exporting={exporting}
							onExport={handleExport}
						/>
						<div className={styles.secondaryActions}>
							<Button
								buttonStyle="secondary"
								onClick={() => goToStep(1)}
								disabled={exporting !== null}
							>
								Modifier le contenu d'origine
							</Button>
						</div>
					</div>
				</Form>
			</section>
		</Gutter>
	);
}
