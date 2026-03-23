import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState, useRef, useEffect } from "react";
import { tss } from "tss-react/dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { api } from "~/utils/api";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import CardDisplay from "../ui/Cards/CardDisplay";

type Message = {
	role: "user" | "assistant";
	content: string | React.ReactNode;
	choices?: string[];
	userStream?: string[];
};

const ChatBot = () => {
	const { classes, cx } = useStyles();

	const { mutateAsync: chatbotSendMessage, isPending: isPendingSendMessage } =
		api.ai.chatbotSend.useMutation();

	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [documentsRetrieved, setDocumentsRetrieved] = useState<
		AugmentedPracticalGuide[]
	>([]);

	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isPendingSendMessage]);

	const onBack = () => {
		setDocumentsRetrieved([]);
		setMessages([]);
	};

	const sendMessage = async (text: string) => {
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
					content:
						"Merci. Voici les ressources qui pourront vous être utiles :",
				},
			]);

			setMessage("");
		}
	};

	return (
		<div className={cx(classes.chatBotContainer, fr.cx("fr-container"))}>
			{!isOpen ? (
				<Button
					className={cx(classes.chatBotButton)}
					onClick={() => setIsOpen(!isOpen)}
					iconId="fr-icon-message-3-fill"
					title="Ouvrir le chatbot d'aide"
				/>
			) : (
				<div className={cx(classes.chatBotWindow)}>
					<div
						style={{
							display: "flex",
							gap: fr.spacing("1w"),
							paddingRight: fr.spacing("2v"),
							paddingLeft: fr.spacing("2v"),
						}}
					>
						<div className={cx(classes.chatBotIcon)}>
							<i className={cx("fr-icon-message-3-fill")} />
						</div>
						<p
							style={{
								color: "white",
								fontSize: "18px",
								fontWeight: "500",
								margin: 0,
							}}
						>
							Bonjour,
							<br />
							Comment pouvons-nous vous aider ?
						</p>
						<Button
							iconId="fr-icon-close-line"
							title="Fermer le chatbot d'aide"
							onClick={() => setIsOpen(!isOpen)}
							style={{
								position: "absolute",
								top: fr.spacing("1v"),
								right: fr.spacing("1v"),
							}}
						/>
					</div>
					<div className={cx(classes.chatBotWindowContent)}>
						{messages.length || isPendingSendMessage ? (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									overflowY: "scroll",
									gap: fr.spacing("3v"),
									maxHeight: "50vh",
								}}
							>
								{messages.map((msg, index) => (
									<div
										key={index}
										style={{
											alignSelf: msg.role === "user" ? "end" : "start",
											color: msg.role === "user" ? "white" : "black",
											padding: fr.spacing("2v"),
											maxWidth: "85%",
										}}
									>
										<div
											style={{
												borderRadius: fr.spacing("2v"),
												padding: fr.spacing("2v"),
												backgroundColor:
													msg.role === "user"
														? fr.colors.options.blueCumulus.main526.default
														: fr.colors.decisions.background.alt.blueFrance
																.default,
											}}
										>
											{msg.content}
										</div>
										{documentsRetrieved.length > 0 &&
											msg.role === "assistant" &&
											index === messages.length - 1 && (
												<div
													style={{
														marginTop: fr.spacing("2v"),
														display: "flex",
														flexDirection: "column",
														gap: fr.spacing("2v"),
													}}
												>
													{documentsRetrieved.map(
														({ id, title, conditions, themes, slug }) => (
															<CardDisplay
																key={id}
																title={title}
																conditions={conditions ?? []}
																themes={themes}
																redirect={`/guides/${slug}`}
																noImg
															/>
														),
													)}
													<Button
														size="small"
														onClick={onBack}
														priority="secondary"
														title="Retour"
														iconId="fr-icon-arrow-left-line"
														style={{ borderRadius: "100px" }}
													>
														Retour
													</Button>
												</div>
											)}
										{msg.choices &&
											msg.choices.length > 0 &&
											!isPendingSendMessage &&
											index === messages.length - 1 && (
												<div
													style={{
														marginTop: fr.spacing("2v"),
														display: "flex",
														flexDirection: "column",
														gap: fr.spacing("2v"),
													}}
												>
													{msg.choices.map((choice, choiceIndex) => (
														<Button
															key={choiceIndex}
															size="small"
															onClick={() => sendMessage(choice)}
															priority="secondary"
															title={choice}
															disabled={isPendingSendMessage}
															style={{ borderRadius: "100px" }}
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
														style={{ borderRadius: "100px" }}
													>
														Retour
													</Button>
												</div>
											)}
									</div>
								))}
								{isPendingSendMessage && (
									<div
										style={{
											alignSelf: "start",
											padding: `0 ${fr.spacing("3v")}`,
										}}
									>
										<div className={cx(classes.typingIndicator)}>
											<span />
											<span />
											<span />
										</div>
									</div>
								)}
								<div ref={messagesEndRef} />
							</div>
						) : (
							<>
								<Input
									textArea
									label=""
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
											"Exemple : “Je souhaite m’informer sur le TSA”",
										autoFocus: true,
										style: {
											background: "none",
											boxShadow: "none",
											outline: "none",
											resize: "none",
										},
										rows: 3,
									}}
									style={{
										marginBottom: 0,
										width: "100%",
									}}
								/>
								<div style={{ marginTop: "auto" }}>
									<hr style={{ paddingBottom: fr.spacing("3v") }} />
									<div
										style={{
											display: "flex",
											justifyContent: "end",
										}}
									>
										<Button
											iconId="fr-icon-arrow-right-up-line"
											disabled={message.trim() === "" || isPendingSendMessage}
											onClick={() => sendMessage(message)}
											title="Envoyer le message"
											style={{ borderRadius: "100%" }}
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
	chatBotContainer: {
		position: "fixed",
		bottom: fr.spacing("2w"),
		left: 0,
		right: 0,
		display: "flex",
		justifyContent: "end",
		zIndex: 1,
	},
	chatBotButton: {
		justifyContent: "center",
		marginRight: 0,
		maxWidth: "100%!important",
		width: "56px",
		maxHeight: "100%!important",
		height: "56px",
		backgroundColor: fr.colors.decisions.artwork.minor.blueFrance.default,
		borderRadius: "100%",
		"::before": {
			marginRight: "0!important",
		},
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
});

export default ChatBot;
