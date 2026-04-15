import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState, useRef, useEffect, useCallback } from "react";
import { tss } from "tss-react/dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { api } from "~/utils/api";
import { chatbotOpenStore } from "~/state/store";
import { useSelector } from "@legendapp/state/react";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

type ChatResponse = {
  content: string;
  guides: AugmentedPracticalGuide[];
};

const ChatBot = () => {
  const { classes, cx } = useStyles();

  const { mutateAsync: chatbotDirectSendMessage, isPending } =
    api.ai.chatbotDirectSend.useMutation();

  const isOpen = useSelector(chatbotOpenStore);

  const [message, setMessage] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const responseContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const checkScrollOverflow = useCallback(() => {
    const container = responseContainerRef.current;
    if (!container) return;
    const hasOverflow =
      container.scrollHeight - container.scrollTop - container.clientHeight >
      20;
    setShowScrollHint(hasOverflow);
  }, []);

  useEffect(() => {
    checkScrollOverflow();
  }, [response, checkScrollOverflow]);

  useEffect(() => {
    if (isOpen && !response) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 50);
    }
  }, [isOpen, response]);

  const onBack = () => {
    setResponse(null);
    setUserQuestion("");
    setMessage("");
  };

  const sendMessage = async (text: string) => {
    setUserQuestion(text);
    setMessage("");
    const result = await chatbotDirectSendMessage({ userMessage: text });
    setResponse(result);
  };

  const scrollToBottom = () => {
    responseContainerRef.current?.scrollTo({
      top: responseContainerRef.current.scrollHeight,
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
            role="dialog"
            aria-modal="true"
            aria-label="Chatbot d'aide"
            tabIndex={-1}
            className={cx(classes.chatBotWindow)}
          >
            <div className={cx(classes.topBar)}>
              <Button
                iconId="fr-icon-close-line"
                title="Fermer le chatbot d'aide"
                priority="tertiary no outline"
                size="small"
                onClick={() => chatbotOpenStore.set(false)}
                className={cx(classes.closeButton)}
              />
            </div>

            <div className={cx(classes.chatBotContent)}>
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
                    <Input
                      textArea
                      label="Votre question"
                      state="default"
                      nativeTextAreaProps={{
                        ref: textAreaRef,
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
                        className: cx(classes.textAreaInput),
                        rows: 3,
                      }}
                      className={cx(classes.textArea)}
                    />
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

              {(isPending || hasResponse) && userQuestion && (
                <div className={cx(classes.userBubbleWrapper)}>
                  <div className={cx(classes.userBubble)}>{userQuestion}</div>
                </div>
              )}

              {isPending && (
                <div className={cx(classes.typingContainer)}>
                  <div className={cx(classes.typingIndicator)}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              {hasResponse && (
                <div className={cx(classes.responseArea)}>
                  <div
                    ref={responseContainerRef}
                    className={cx(classes.responseContainer)}
                    onScroll={checkScrollOverflow}
                  >
                    <p className={cx(classes.sourcesLabel)}>
                      <i className="fr-icon-chat-3-line" aria-hidden="true" />
                      En résumé
                    </p>
                    <p className={cx(classes.resourcesIntro)}>
                      {response.content}
                    </p>
                    {response.guides.length > 0 && (
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
                                href={`/guides/${slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
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
                    )}
                  </div>
                  {showScrollHint && (
                    <button
                      className={cx(classes.scrollHint)}
                      onClick={scrollToBottom}
                      aria-label="Voir la suite"
                    >
                      <i
                        className="fr-icon-arrow-down-s-line"
                        aria-hidden="true"
                      />
                      <span>Voir la suite</span>
                    </button>
                  )}
                  <div className={cx(classes.backAction)}>
                    <Button
                      size="small"
                      onClick={onBack}
                      priority="secondary"
                      title="Poser une autre question"
                      iconId="fr-icon-arrow-left-line"
                      className={cx(classes.pillButton)}
                    >
                      Poser une autre question
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
        title={isOpen ? "Fermer le chatbot d'aide" : "Ouvrir le chatbot d'aide"}
      >
        {isOpen ? "Fermer" : "Posez votre question"}
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
    backgroundColor: fr.colors.decisions.artwork.minor.blueFrance.default,
    borderRadius: fr.spacing("6v"),
    position: "relative",
    marginTop: fr.spacing("2v"),
    zIndex: 1100,
    alignSelf: "flex-end",
  },
  chatBotButtonOpen: {
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
      backgroundColor: fr.colors.decisions.background.contrast.grey.hover,
    },
  },
  chatBotContent: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: `${fr.spacing("4v")} ${fr.spacing("5v")}`,
    gap: fr.spacing("3v"),
    overflow: "hidden",
    minHeight: "300px",
    [fr.breakpoints.down("md")]: {
      padding: `${fr.spacing("3v")} ${fr.spacing("3v")}`,
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
    backgroundColor: fr.colors.decisions.background.actionHigh.blueFrance.default,
    color: fr.colors.decisions.text.inverted.grey.default,
    borderRadius: fr.spacing("2v"),
    padding: `${fr.spacing("2v")} ${fr.spacing("3v")}`,
    maxWidth: "85%",
    lineHeight: 1.6,
  },
  responseArea: {
    position: "relative",
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    gap: fr.spacing("3v"),
  },
  responseContainer: {
    overflowY: "auto",
    maxHeight: "50vh",
    paddingRight: fr.spacing("2v"),
    paddingBottom: fr.spacing("4v"),
    lineHeight: 1.6,
    [fr.breakpoints.down("md")]: {
      maxHeight: "none",
      flex: 1,
    },
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
  pillButton: {
    borderRadius: "100px",
  },
  scrollHint: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: fr.spacing("1v"),
    padding: `${fr.spacing("1v")} ${fr.spacing("3v")}`,
    backgroundColor: fr.colors.decisions.background.actionHigh.blueFrance.default,
    color: fr.colors.decisions.text.inverted.grey.default,
    border: "none",
    borderRadius: "100px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: 500,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    "& i::before": {
      "--icon-size": "0.875rem",
    },
    "&:hover": {
      opacity: 0.9,
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
      "&:nth-child(1)": { animationDelay: "0s" },
      "&:nth-child(2)": { animationDelay: "0.2s" },
      "&:nth-child(3)": { animationDelay: "0.4s" },
    },
    "@keyframes typingBounce": {
      "0%, 60%, 100%": { transform: "translateY(0)" },
      "30%": { transform: "translateY(-6px)" },
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
  textAreaInput: {
    background: "none",
    boxShadow: "none",
    resize: "none",
  },
  textArea: {
    marginBottom: 0,
    width: "100%",
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
