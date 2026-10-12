import { fr } from "@codegouvfr/react-dsfr";
import { useId } from "react";

export default function Transcription({
	content,
	title = "Transcription",
}: {
	content: string;
	title?: string;
}) {
	const id = `transcription-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
	const collapseId = `${id}-collapse`;
	const modalId = `${id}-modal`;
	const paragraphs = content
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	return (
		<div className={fr.cx("fr-transcription")}>
			<button
				type="button"
				className={fr.cx("fr-transcription__btn")}
				aria-expanded="false"
				aria-controls={collapseId}
			>
				Transcription
			</button>
			<div className={fr.cx("fr-collapse")} id={collapseId}>
				<div className={fr.cx("fr-transcription__footer")}>
					<div className={fr.cx("fr-transcription__actions-group")}>
						<button
							type="button"
							className={fr.cx("fr-btn--fullscreen", "fr-btn")}
							aria-controls={modalId}
							data-fr-opened="false"
							aria-label="Agrandir la transcription"
						>
							Agrandir
						</button>
					</div>
				</div>
				<div
					id={modalId}
					className={fr.cx("fr-modal")}
					role="dialog"
					aria-labelledby={`${modalId}-title`}
				>
					<div
						className={fr.cx(
							"fr-container",
							"fr-container--fluid",
							"fr-container-md",
						)}
					>
						<div className={fr.cx("fr-grid-row", "fr-grid-row--center")}>
							<div
								className={fr.cx("fr-col-12", "fr-col-md-10", "fr-col-lg-8")}
							>
								<div className={fr.cx("fr-modal__body")}>
									<div className={fr.cx("fr-modal__header")}>
										<button
											type="button"
											className={fr.cx("fr-btn--close", "fr-btn")}
											aria-controls={modalId}
											title="Fermer"
										>
											Fermer
										</button>
									</div>
									<div className={fr.cx("fr-modal__content")}>
										<h1
											id={`${modalId}-title`}
											className={fr.cx("fr-modal__title")}
										>
											{title}
										</h1>
										{paragraphs.map((paragraph, index) => (
											<p key={index} style={{ whiteSpace: "pre-line" }}>
												{paragraph}
											</p>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
