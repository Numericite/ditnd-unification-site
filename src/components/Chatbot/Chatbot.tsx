import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState, useRef, useEffect, useCallback } from "react";
import { tss } from "tss-react/dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { api } from "~/utils/api";
import { chatbotOpenStore } from "~/state/store";
import { useSelector } from "@legendapp/state/react";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import type { AugmentedCourse } from "~/server/api/routers/courses";

type ChatResponse = {
	content: string;
	guides: AugmentedPracticalGuide[];
	courses: AugmentedCourse[];
	primarySource: "guides" | "courses";
};

// Reject inputs longer than this without calling the LLM. Sized for a few-sentence question;
// anything longer is likely a paste error or abuse. Keep in sync with the server-side limit
// in src/server/api/routers/ai.ts.
const MAX_USER_MESSAGE_CHARS = 800;

const ChatBot = () => {
	const { classes, cx } = useStyles();

	const { mutateAsync: chatbotDirectSendMessage, isPending } =
		api.ai.chatbotDirectSend.useMutation();

	const isOpen = useSelector(chatbotOpenStore);

	const [message, setMessage] = useState("");
	const [userQuestion, setUserQuestion] = useState("");
	const [response, setResponse] = useState<ChatResponse | null>(null);
	const [showScrollHint, setShowScrollHint] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);
	const backButtonRef = useRef<HTMLButtonElement>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);

	const checkScrollHint = useCallback(() => {
		const el = scrollAreaRef.current;
		if (!el) return;
		setShowScrollHint(el.scrollHeight - el.scrollTop - el.clientHeight > 20);
	}, []);

	useEffect(() => {
		if (response) {
			scrollAreaRef.current?.scrollTo({ top: 0 });
			requestAnimationFrame(checkScrollHint);
		}
	}, [response, checkScrollHint]);

	useEffect(() => {
		if (isOpen && !response) {
			setTimeout(() => {
				textAreaRef.current?.focus();
			}, 50);
		}
	}, [isOpen, response]);

	useEffect(() => {
		if (!isOpen) return;
		const mql = window.matchMedia("(max-width: 767px)");
		if (!mql.matches) return;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			previouslyFocusedRef.current =
				(document.activeElement as HTMLElement | null) ?? null;
		} else if (previouslyFocusedRef.current) {
			previouslyFocusedRef.current.focus();
			previouslyFocusedRef.current = null;
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				chatbotOpenStore.set(false);
				return;
			}
			if (e.key === "Tab" && dialogRef.current) {
				const focusable = Array.from(
					dialogRef.current.querySelectorAll<HTMLElement>(
						'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
					),
				).filter(
					(el) => el.offsetParent !== null || el === document.activeElement,
				);
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (!first || !last) return;
				const active = document.activeElement as HTMLElement | null;
				if (
					e.shiftKey &&
					(active === first || !dialogRef.current.contains(active))
				) {
					e.preventDefault();
					last.focus();
				} else if (
					!e.shiftKey &&
					(active === last || !dialogRef.current.contains(active))
				) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	useEffect(() => {
		if (response) {
			setTimeout(() => {
				backButtonRef.current?.focus();
			}, 50);
		}
	}, [response]);

	const onBack = () => {
		setResponse(null);
		setUserQuestion("");
		setMessage("");
		setError(null);
	};

	const autoResizeTextArea = useCallback(() => {
		const ta = textAreaRef.current;
		if (!ta) return;
		ta.style.height = "auto";
		ta.style.height = `${Math.min(ta.scrollHeight, 400)}px`;
	}, []);

	const sendMessage = async (text: string) => {
		dialogRef.current?.focus();
		setUserQuestion(text);
		setMessage("");
		setError(null);

		if (text.length > MAX_USER_MESSAGE_CHARS) {
			setResponse({
				content:
					"Votre question est un peu longue pour moi. Pourriez-vous la reformuler en quelques phrases ?",
				guides: [],
				courses: [],
				primarySource: "guides",
			});
			return;
		}

		try {
			const result = await chatbotDirectSendMessage({
				userMessage: text,
			});
			setResponse(result);
		} catch {
			setError(
				"Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.",
			);
			setUserQuestion("");
		}
	};

	const scrollToBottom = () => {
		scrollAreaRef.current?.scrollTo({
			top: scrollAreaRef.current.scrollHeight,
			behavior: "smooth",
		});
	};

	const hasResponse = response !== null;

	return (
		<div className={cx(classes.root)}>
			{isOpen && (
				<>
					<div
						className={cx(classes.overlay)}
						onClick={() => chatbotOpenStore.set(false)}
						aria-hidden="true"
					/>
					<div
						ref={dialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="chatbot-title"
						tabIndex={-1}
						className={cx(classes.chatBotWindow)}
					>
						<h2 id="chatbot-title" className="fr-sr-only">
							Assistant conversationnel
						</h2>
						<div className={cx(classes.topBar)}>
							<Button
								iconId="fr-icon-close-line"
								title="Fermer l'assistant conversationnel"
								priority="tertiary no outline"
								size="small"
								onClick={() => chatbotOpenStore.set(false)}
								className={cx(classes.closeButton)}
							/>
						</div>

						<output
							aria-live="polite"
							aria-atomic="true"
							className="fr-sr-only"
						>
							{isPending && "Chargement de la réponse en cours"}
							{!isPending && hasResponse && "Réponse reçue"}
						</output>

						<div
							ref={scrollAreaRef}
							className={cx(classes.chatBotContent)}
							onScroll={checkScrollHint}
						>
							{!hasResponse && !isPending && (
								<>
									<div className={cx(classes.welcome)}>
										<div className={cx(classes.welcomeIcon)}>
											<i
												className={cx("fr-icon-message-3-fill")}
												aria-hidden="true"
											/>
										</div>
										<p className={cx(classes.welcomeText)}>
											Comment pouvons-nous vous aider ?
										</p>
									</div>

									<div className={cx(classes.inputArea)}>
										{error && (
											<p role="alert" className={cx(classes.errorMessage)}>
												{error}
											</p>
										)}
										<Input
											textArea
											label="Votre question"
											state="default"
											hintText="Exemple : “Je souhaite m’informer sur le TSA”"
											nativeTextAreaProps={{
												ref: textAreaRef,
												value: message,
												onChange: (e) => {
													setMessage(e.target.value);
													autoResizeTextArea();
												},
												onKeyDown: (e) => {
													if (
														e.key === "Enter" &&
														!e.shiftKey &&
														message.trim() !== ""
													) {
														e.preventDefault();
														sendMessage(message);
													}
												},
												rows: 1,
											}}
											className={cx(classes.textArea)}
										/>
										<div className={cx(classes.sendButtonContainer)}>
											<Button
												iconId="fr-icon-arrow-right-up-line"
												disabled={message.trim() === "" || isPending}
												onClick={() => sendMessage(message)}
												title="Envoyer le message"
											>
												Envoyer
											</Button>
										</div>
									</div>
								</>
							)}

							{(isPending || hasResponse) && userQuestion && (
								<div className={cx(classes.userBubbleWrapper)}>
									<div className={cx(classes.userBubble)}>{userQuestion}</div>
								</div>
							)}

							{isPending && (
								<div className={cx(classes.typingContainer)} aria-hidden="true">
									<div className={cx(classes.typingIndicator)}>
										<span />
										<span />
										<span />
									</div>
								</div>
							)}

							{hasResponse && (
								<>
									<p className={cx(classes.sourcesLabel)}>
										<i className="fr-icon-chat-3-line" aria-hidden="true" />
										En résumé
									</p>
									<p className={cx(classes.resourcesIntro)}>
										{response.content}
									</p>
									{(() => {
										const guidesSection = response.guides.length > 0 && (
											<div className={cx(classes.sourcesSection)}>
												<p className={cx(classes.sourcesLabel)}>
													<i
														className="fr-icon-book-2-line"
														aria-hidden="true"
													/>
													Consultez les fiches pratiques
												</p>
												<ul className={cx(classes.resourcesList)}>
													{response.guides.map(({ id, title, slug }) => (
														<li key={id}>
															<a
																className={cx(classes.sourceCard)}
																href={`/fiches-pratiques/${slug}`}
																target="_blank"
																rel="noopener noreferrer"
																aria-label={`${title}, nouvelle fenêtre`}
																title={`${title}, nouvelle fenêtre`}
															>
																<span className={cx(classes.sourceCardTitle)}>
																	{title}
																</span>
															</a>
														</li>
													))}
												</ul>
											</div>
										);

										const coursesSection = response.courses?.length > 0 && (
											<div className={cx(classes.sourcesSection)}>
												<p className={cx(classes.sourcesLabel)}>
													<i
														className="fr-icon-lightbulb-line"
														aria-hidden="true"
													/>
													Consultez les formations
												</p>
												<ul className={cx(classes.resourcesList)}>
													{response.courses.map(({ id, title, link }) => (
														<li key={id}>
															<a
																className={cx(classes.sourceCard)}
																href={link}
																target="_blank"
																rel="noopener noreferrer"
																aria-label={`${title}, nouvelle fenêtre`}
																title={`${title}, nouvelle fenêtre`}
															>
																<span className={cx(classes.sourceCardTitle)}>
																	{title}
																</span>
															</a>
														</li>
													))}
												</ul>
											</div>
										);

										return response.primarySource === "courses" ? (
											<>
												{coursesSection}
												{guidesSection}
											</>
										) : (
											<>
												{guidesSection}
												{coursesSection}
											</>
										);
									})()}
									<div className={cx(classes.backAction)}>
										<Button
											size="small"
											onClick={onBack}
											priority="secondary"
											title="Poser une autre question"
											iconId="fr-icon-arrow-left-line"
											nativeButtonProps={{ ref: backButtonRef }}
										>
											Poser une autre question
										</Button>
									</div>
								</>
							)}
						</div>
						{showScrollHint && (
							<button
								type="button"
								className={cx(classes.scrollHint)}
								onClick={scrollToBottom}
								aria-label="Voir la suite"
							>
								<i className="fr-icon-arrow-down-s-line" aria-hidden="true" />
								<span>Voir la suite</span>
							</button>
						)}
					</div>
				</>
			)}
			<Button
				className={cx(
					classes.chatBotButton,
					isOpen && classes.chatBotButtonOpen,
				)}
				onClick={() => chatbotOpenStore.set(!isOpen)}
				iconId={isOpen ? "fr-icon-close-line" : "fr-icon-message-3-fill"}
				title={
					isOpen
						? "Fermer l'assistant conversationnel"
						: "Ouvrir l'assistant conversationnel"
				}
			>
				{isOpen ? "Fermer l'assistant" : "Posez votre question"}
			</Button>
		</div>
	);
};

const useStyles = tss.withName(ChatBot.name).create({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
	},
	chatBotButton: {
		zIndex: 1100,
		alignSelf: "flex-end",
		[fr.breakpoints.down("md")]: {
			width: "100%",
			borderRadius: 0,
			justifyContent: "center",
			position: "fixed",
			bottom: 0,
		},
	},
	chatBotButtonOpen: {
		marginTop: fr.spacing("4v"),
		[fr.breakpoints.down("md")]: {
			display: "none",
		},
	},
	overlay: {
		position: "fixed",
		inset: 0,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		zIndex: 1099,
		cursor: "pointer",
		[fr.breakpoints.down("md")]: {
			display: "none",
		},
	},
	chatBotWindow: {
		width: "800px",
		maxWidth: "100%",
		display: "flex",
		flexDirection: "column",
		borderRadius: fr.spacing("2v"),
		overflow: "hidden",
		boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		position: "relative",
		zIndex: 1100,
		[fr.breakpoints.down("md")]: {
			position: "fixed",
			inset: 0,
			width: "100%",
			height: "100%",
			borderRadius: 0,
			zIndex: 1100,
		},
	},
	topBar: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		padding: `${fr.spacing("1v")} ${fr.spacing("2v")}`,
		backgroundColor: fr.colors.decisions.artwork.major.blueFrance.default,
	},
	closeButton: {
		color: fr.colors.decisions.text.inverted.grey.default,
		"&:hover": {
			backgroundColor: `${fr.colors.decisions.artwork.major.blueFrance.hover} !important`,
		},
	},
	chatBotContent: {
		display: "flex",
		flexDirection: "column",
		flex: 1,
		padding: `${fr.spacing("4v")} ${fr.spacing("5v")}`,
		gap: fr.spacing("3v"),
		overflowY: "auto",
		minHeight: "300px",
		maxHeight: "70vh",
		[fr.breakpoints.down("md")]: {
			padding: `${fr.spacing("3v")} ${fr.spacing("3v")}`,
			maxHeight: "none",
		},
	},
	welcome: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: fr.spacing("3v"),
		padding: `${fr.spacing("6v")} 0`,
	},
	welcomeIcon: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "56px",
		height: "56px",
		borderRadius: "100%",
		backgroundColor: fr.colors.decisions.artwork.minor.blueFrance.default,
		"& i": {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			color: fr.colors.decisions.text.inverted.grey.default,
			"::before": {
				margin: 0,
				"--icon-size": "1.5rem",
			},
		},
	},
	welcomeText: {
		fontSize: "1.25rem",
		fontWeight: 500,
		color: fr.colors.decisions.text.title.grey.default,
		margin: 0,
		textAlign: "center",
	},
	userBubbleWrapper: {
		display: "flex",
		justifyContent: "flex-end",
		marginBottom: fr.spacing("2v"),
	},
	userBubble: {
		backgroundColor:
			fr.colors.decisions.background.actionHigh.blueFrance.default,
		color: fr.colors.decisions.text.inverted.grey.default,
		borderRadius: fr.spacing("2v"),
		padding: `${fr.spacing("2v")} ${fr.spacing("3v")}`,
		maxWidth: "85%",
		lineHeight: 1.6,
	},
	backAction: {
		paddingTop: fr.spacing("2v"),
	},
	resourcesIntro: {
		margin: 0,
	},
	sourcesSection: {
		marginTop: fr.spacing("4v"),
		borderTop: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		paddingTop: fr.spacing("3v"),
	},
	sourcesLabel: {
		display: "flex",
		alignItems: "center",
		gap: fr.spacing("1v"),
		margin: 0,
		marginBottom: fr.spacing("2v"),
		fontSize: "0.875rem",
		fontWeight: 700,
		color: fr.colors.decisions.text.mention.grey.default,
		textTransform: "uppercase",
		letterSpacing: "0.05em",
		"& i::before": {
			"--icon-size": "1rem",
		},
	},
	resourcesList: {
		listStyle: "none",
		padding: 0,
		margin: 0,
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("2v"),
	},
	sourceCard: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: fr.spacing("2v"),
		padding: `${fr.spacing("2v")} ${fr.spacing("3v")}`,
		borderRadius: fr.spacing("1v"),
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		textDecoration: "none",
		color: fr.colors.decisions.text.actionHigh.blueFrance.default,
		transition: "background-color 0.2s, box-shadow 0.2s",
		"&:hover": {
			backgroundColor: fr.colors.decisions.background.alt.blueFrance.hover,
			boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
		},
	},
	sourceCardTitle: {
		fontSize: "0.875rem",
		fontWeight: 500,
		flex: 1,
	},
	scrollHint: {
		position: "absolute",
		bottom: fr.spacing("2v"),
		left: "50%",
		transform: "translateX(-50%)",
		display: "flex",
		alignItems: "center",
		gap: fr.spacing("1v"),
		padding: `${fr.spacing("1v")} ${fr.spacing("3v")}`,
		backgroundColor:
			fr.colors.decisions.background.actionHigh.blueFrance.default,
		color: fr.colors.decisions.text.inverted.grey.default,
		border: "none",
		borderRadius: "100px",
		cursor: "pointer",
		fontSize: "0.75rem",
		fontWeight: 500,
		boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
		zIndex: 1,
		"& i::before": {
			"--icon-size": "0.875rem",
		},
		"&:hover": {
			backgroundColor: `${fr.colors.decisions.background.actionHigh.blueFrance.hover} !important`,
			color: fr.colors.decisions.text.inverted.grey.default,
		},
		[fr.breakpoints.down("md")]: {
			left: "auto",
			right: fr.spacing("2v"),
			transform: "none",
		},
	},
	typingContainer: {
		alignSelf: "start",
		padding: `0 ${fr.spacing("3v")}`,
	},
	typingIndicator: {
		display: "flex",
		alignItems: "center",
		gap: "5px",
		padding: `${fr.spacing("2v")} ${fr.spacing("3v")}`,
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		borderRadius: fr.spacing("2v"),
		width: "fit-content",
		"& span": {
			display: "inline-block",
			width: "6px",
			height: "6px",
			borderRadius: "50%",
			backgroundColor:
				fr.colors.decisions.background.actionHigh.blueFrance.default,
			animation: "typingBounce 1.2s ease-in-out infinite",
			"&:nth-of-type(1)": { animationDelay: "0s" },
			"&:nth-of-type(2)": { animationDelay: "0.2s" },
			"&:nth-of-type(3)": { animationDelay: "0.4s" },
		},
		"@keyframes typingBounce": {
			"0%, 60%, 100%": { transform: "translateY(0)" },
			"30%": { transform: "translateY(-6px)" },
		},
		"@media (prefers-reduced-motion: reduce)": {
			"& span": {
				animation: "none",
				opacity: 0.6,
			},
		},
	},
	inputArea: {
		marginTop: "auto",
		borderTop: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		paddingTop: fr.spacing("3v"),
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("2v"),
	},
	textArea: {
		marginBottom: 0,
		width: "100%",
		textarea: {
			resize: "vertical",
		},
	},
	sendButtonContainer: {
		display: "flex",
		justifyContent: "end",
	},
	errorMessage: {
		margin: 0,
		padding: `${fr.spacing("2v")} ${fr.spacing("3v")}`,
		borderRadius: fr.spacing("1v"),
		backgroundColor: fr.colors.decisions.background.contrast.error.default,
		color: fr.colors.decisions.text.default.error.default,
		fontSize: "0.875rem",
	},
});

export default ChatBot;
