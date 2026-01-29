import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";
import { tss } from "tss-react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { api } from "~/utils/api";
import { Loader } from "../ui/Loader";

type Message = {
	role: "user" | "assistant";
	content: string;
	choices?: string[];
	userStream?: string[];
};

const ChatBot = () => {
	const { classes, cx } = useStyles();

	const { mutateAsync: chatbotSendMessage, isPending: isPendingSendMessage } =
		api.ai.chatbotSend.useMutation();

	const [isOpen, setIsOpen] = useState(true);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);

	const sendMessage = async (text: string) => {
		const response = await chatbotSendMessage([
			...messages,
			{ role: "user", content: text },
		]);
		const chatbotAnswer = JSON.parse(
			response.choices[0].message.content,
		) as Omit<Message, "role">;
		console.log("chatbotAnswer", chatbotAnswer);
		setMessages((prev) => [
			...prev,
			{ role: "user", content: text },
			{
				role: "assistant",
				content: chatbotAnswer.content || "",
				choices: chatbotAnswer.choices || [],
			},
		]);
		setMessage("");
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
						<Button
							className={cx(classes.chatBotButton)}
							iconId="fr-icon-message-3-fill"
							title="Ouvrir le chatbot d'aide"
						/>
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
											backgroundColor:
												msg.role === "user"
													? fr.colors.options.blueCumulus.main526.default
													: fr.colors.decisions.background.alt.blueFrance
															.default,
											color: msg.role === "user" ? "white" : "black",
											padding: fr.spacing("2v"),
											borderRadius: fr.spacing("2v"),
											maxWidth: "80%",
										}}
									>
										{msg.content}
										{msg.choices &&
											msg.choices.length > 0 &&
											index === messages.length - 1 && (
												<div
													style={{
														marginTop: fr.spacing("2v"),
														display: "flex",
														flexDirection: "column",
														gap: fr.spacing("1v"),
													}}
												>
													{msg.choices.map((choice, choiceIndex) => (
														<Button
															key={choiceIndex}
															onClick={() => sendMessage(choice)}
															title={choice}
															disabled={isPendingSendMessage}
															style={{ textAlign: "left" }}
														>
															{choice}
														</Button>
													))}
												</div>
											)}
									</div>
								))}
								{isPendingSendMessage && <Loader />}
							</div>
						) : (
							<>
								<Input
									textArea
									label=""
									state="default"
									stateRelatedMessage="Text de validation / d'explication de l'erreur"
									nativeTextAreaProps={{
										value: message,
										onChange: (e) => setMessage(e.target.value),
										rows: 4,
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
		zIndex: 0,
	},
	chatBotButton: {
		backgroundColor: fr.colors.decisions.artwork.minor.blueFrance.default,
		borderRadius: "100%",
	},
	chatBotIcon: {
		color: "white",
		width: "32px",
		height: "32px",
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
});

export default ChatBot;
