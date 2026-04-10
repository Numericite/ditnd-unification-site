import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState, useRef, useEffect } from "react";
import { tss } from "tss-react/dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { api } from "~/utils/api";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

type Message = {
	role: "user" | "assistant";
	content: string | React.ReactNode;
	choices?: string[];
	userStream?: string[];
};

type Props = {
	mode?: "guided" | "direct";
};

const ChatBot = ({ mode = "guided" }: Props) => {
	const { classes, cx } = useStyles();

	const { mutateAsync: chatbotSendMessage, isPending: isPendingSendMessage } =
		api.ai.chatbotSend.useMutation();

	const {
		mutateAsync: chatbotDirectSendMessage,
		isPending: isPendingDirectSend,
	} = api.ai.chatbotDirectSend.useMutation();

	const isPending =
		mode === "direct" ? isPendingDirectSend : isPendingSendMessage;

	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [documentsRetrieved, setDocumentsRetrieved] = useState<
		AugmentedPracticalGuide[]
	>([]);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isPending]);

	useEffect(() => {
		if (isOpen) dialogRef.current?.focus();
	}, [isOpen]);


	const onBack = () => {
		setDocumentsRetrieved([]);
		setMessages([]);
	};

	const sendDirectMessage = async (text: string) => {
		setMessages((prev) => [...prev, { role: "user", content: text }]);
		setMessage("");

		const response = await chatbotDirectSendMessage({ userMessage: text });

		setMessages((prev) => [
			...prev,
			{
				role: "assistant",
				content: (
					<div>
						<p className={cx(classes.resourcesIntro)}>{response.content}</p>
						{response.guides.length > 0 && (
							<ul className={cx(classes.resourcesList)}>
								{response.guides.map(({ id, title, slug }) => (
									<li key={id}>
										<a
											className="fr-link fr-icon-external-link-line fr-link--icon-right"
											href={`/guides/${slug}`}
											target="_blank"
											rel="noopener noreferrer"
											title={`${title} (nouvelle fenêtre)`}
										>
											{title}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
				),
			},
		]);
	};

	const sendMessage = async (text: string) => {
		if (mode === "direct") {
			await sendDirectMessage(text);
			return;
		}

		const messagesForApi = messages.filter(
			(msg): msg is Message & { content: string } =>
				typeof msg.content === "string",
		);

		setMessages((prev) => [
			...prev,
			{
				role: "user",
				content: text,
			},
		]);

		const response = await chatbotSendMessage({
			messages: [...messagesForApi, { role: "user", content: text }],
			promptName: "chatbot-system-v2.md",
		});

		if ("choices" in response) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: response.content,
					choices: response.choices || [],
				},
			]);
			setMessage("");
		} else if (Array.isArray(response)) {
			setDocumentsRetrieved(response);

			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: (
						<div>
							<p className={cx(classes.resourcesIntro)}>
								Merci. Voici les ressources qui pourront vous être utiles :
							</p>
							<ul className={cx(classes.resourcesList)}>
								{response.map(({ id, title, slug }) => (
									<li key={id}>
										<a
											className="fr-link fr-icon-external-link-line fr-link--icon-right"
											href={`/guides/${slug}`}
											target="_blank"
											rel="noopener noreferrer"
											title={`${title} (nouvelle fenêtre)`}
										>
											{title}
										</a>
									</li>
								))}
							</ul>
						</div>
					),
				},
			]);

			setMessage("");
		}
	};

	return (
		<div>
			{!isOpen ? (
				<Button
					className={cx(classes.chatBotButton)}
					onClick={() => setIsOpen(!isOpen)}
					iconId="fr-icon-message-3-fill"
					title="Ouvrir le chatbot d'aide"
				>
					{mode === "guided" ? "Guidé" : "Direct"}
				</Button>
			) : (
				<div
					ref={dialogRef}
					role="dialog"
					aria-modal="true"
					aria-label="Chatbot d'aide"
					tabIndex={-1}
					className={cx(classes.chatBotWindow)}>
					<div className={cx(classes.chatBotHeader)}>
						<div className={cx(classes.chatBotIcon)}>
							<i className={cx("fr-icon-message-3-fill")} aria-hidden="true" />
						</div>
						<p className={cx(classes.chatBotTitle)}>
							Bonjour, !
							<br />
							Comment pouvons-nous vous aider ?
						</p>
						<Button
							iconId="fr-icon-close-line"
							title="Fermer le chatbot d'aide"
							onClick={() => setIsOpen(!isOpen)}
							className={cx(classes.chatBotCloseButton)}
						/>
					</div>
					<div className={cx(classes.chatBotWindowContent)}>
						{(messages.length > 0 || isPending) && (
							<div className={cx(classes.messagesContainer)}>
								{messages.map((msg, index) => (
									<div
										key={index}
										className={cx(
											classes.messageWrapper,
											msg.role === "user"
												? classes.messageWrapperUser
												: classes.messageWrapperAssistant,
										)}

									>
										<div
											className={cx(
												classes.messageBubble,
												msg.role === "user"
													? classes.messageBubbleUser
													: classes.messageBubbleAssistant,
											)}
										>
											{msg.content}
										</div>
										{((documentsRetrieved.length > 0 &&
											msg.role === "assistant" &&
											index === messages.length - 1) ||
											(mode === "direct" && msg.role === "assistant")) && (
												<div className={cx(classes.actionsContainer)}>
													<Button
														size="small"
														onClick={onBack}
														priority="secondary"
														title="Retour"
														iconId="fr-icon-arrow-left-line"
														className={cx(classes.pillButton)}
													>
														Retour
													</Button>
												</div>
											)}
										{mode === "guided" &&
											msg.choices &&
											msg.choices.length > 0 &&
											!isPending &&
											index === messages.length - 1 && (
												<div className={cx(classes.actionsContainer)}>
													{msg.choices.map((choice, choiceIndex) => (
														<Button
															key={choiceIndex}
															size="small"
															onClick={() => sendMessage(choice)}
															priority="secondary"
															title={choice}
															disabled={isPending}
															className={cx(classes.pillButton)}
														>
															{choice}
														</Button>
													))}
													<Button
														size="small"
														onClick={() => setMessages([])}
														priority="secondary"
														title="Retour"
														iconId="fr-icon-arrow-left-line"
														className={cx(classes.pillButton)}
													>
														Retour
													</Button>
												</div>
											)}
									</div>
								))}
								{isPending && (
									<div className={cx(classes.typingContainer)}>
										<div className={cx(classes.typingIndicator)}>
											<span />
											<span />
											<span />
										</div>
									</div>
								)}
								<div ref={messagesEndRef} />
							</div>
						)}
						{messages.length === 0 && (
							<>
								<Input
									textArea
									label="Votre message"
									state="default"
									nativeTextAreaProps={{
										value: message,
										onChange: (e) => setMessage(e.target.value),
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
										placeholder:
											"Exemple : \u201CJe souhaite m\u2019informer sur le TSA\u201D",
										autoFocus: true,
										className: cx(classes.textAreaInput),
										rows: 3,
									}}
									className={cx(classes.textArea)}
								/>
								<div className={cx(classes.sendArea)}>
									<hr className={cx(classes.sendAreaDivider)} />
									<div className={cx(classes.sendButtonContainer)}>
										<Button
											iconId="fr-icon-arrow-right-up-line"
											disabled={message.trim() === "" || isPending}
											onClick={() => sendMessage(message)}
											title="Envoyer le message"
											className={cx(classes.sendButton)}
										/>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const useStyles = tss.withName(ChatBot.name).create({
	chatBotButton: {
		// justifyContent: "center",
		// marginRight: 0,
		// maxWidth: "100%!important",
		// width: "56px",
		// maxHeight: "100%!important",
		// height: "56px",
		backgroundColor: fr.colors.decisions.artwork.minor.blueFrance.default,
		borderRadius: fr.spacing("6v"),
	},
	chatBotHeader: {
		display: "flex",
		gap: fr.spacing("1w"),
		paddingRight: fr.spacing("2v"),
		paddingLeft: fr.spacing("2v"),
	},
	chatBotIcon: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "46px",
		height: "46px",
		minWidth: "46px",
		borderRadius: "100%",
		backgroundColor: fr.colors.decisions.artwork.minor.blueFrance.default,
		"& i": {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			color: "white",
			"::before": {
				margin: 0,
			},
		},
	},
	chatBotTitle: {
		color: "white",
		fontSize: "1.125rem",
		fontWeight: "500",
		margin: 0,
	},
	chatBotCloseButton: {
		position: "absolute",
		top: fr.spacing("1v"),
		right: fr.spacing("1v"),
	},
	chatBotWindow: {
		width: "450px",
		backgroundColor: fr.colors.decisions.artwork.major.blueFrance.default,
		borderRadius: fr.spacing("3v"),
		padding: `${fr.spacing("3v")} ${fr.spacing("2v")}`,
		paddingBottom: fr.spacing("2v"),
		gap: fr.spacing("1w"),
		display: "flex",
		flexDirection: "column",
		position: "relative",
	},
	chatBotWindowContent: {
		backgroundColor: "white",
		borderRadius: fr.spacing("3v"),
		marginTop: fr.spacing("1v"),
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("4w"),
		padding: `${fr.spacing("3v")} ${fr.spacing("5v")}`,
	},
	messagesContainer: {
		display: "flex",
		flexDirection: "column",
		overflowY: "scroll",
		gap: fr.spacing("3v"),
		maxHeight: "50vh",
	},
	messageWrapper: {
		padding: fr.spacing("2v"),
		maxWidth: "85%",
	},
	messageWrapperUser: {
		alignSelf: "end",
		color: "white",
	},
	messageWrapperAssistant: {
		alignSelf: "start",
		color: "black",
	},
	messageBubble: {
		borderRadius: fr.spacing("2v"),
		padding: fr.spacing("2v"),
	},
	messageBubbleUser: {
		backgroundColor: fr.colors.options.blueCumulus.main526.default,
	},
	messageBubbleAssistant: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
	},
	resourcesIntro: {
		margin: 0,
	},
	resourcesList: {
		listStyle: "none",
		padding: 0,
		marginTop: fr.spacing("2v"),
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("1v"),
	},
	actionsContainer: {
		marginTop: fr.spacing("2v"),
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("2v"),
	},
	pillButton: {
		borderRadius: "100px",
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
			"&:nth-child(1)": { animationDelay: "0s" },
			"&:nth-child(2)": { animationDelay: "0.2s" },
			"&:nth-child(3)": { animationDelay: "0.4s" },
		},
		"@keyframes typingBounce": {
			"0%, 60%, 100%": { transform: "translateY(0)" },
			"30%": { transform: "translateY(-6px)" },
		},
	},
	textAreaInput: {
		background: "none",
		boxShadow: "none",
		resize: "none",
	},
	textArea: {
		marginBottom: 0,
		width: "100%",
	},
	sendArea: {
		marginTop: "auto",
	},
	sendAreaDivider: {
		paddingBottom: fr.spacing("3v"),
	},
	sendButtonContainer: {
		display: "flex",
		justifyContent: "end",
	},
	sendButton: {
		borderRadius: "100%",
	},
});

export default ChatBot;
