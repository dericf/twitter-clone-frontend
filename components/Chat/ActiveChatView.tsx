// React
import React, {
  LegacyRef,
  TextareaHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import { useEmitter } from "../../hooks/useEmitter";
import { WSMessage } from "../../schema/WebSockets";

// Utils
import { dateFormat, timeFormat, timeFromNow } from "../../utilities/dates";
import { BackToConversationsButton } from "./BackToConversationsButton";

import WSC from "../../websocket/client";
import { formatUsername } from "../../utilities/formating";
import { Button } from "../UI/Button";
import { useAlert } from "../../hooks/useAlert";
import { ChatUserOnlineResponseBody } from "../../schema/Chat";

// const mobile = require('is-mobile');

// const ShowMobile = dynamic(() => mobile() ? import('./ShowMobile.mobile') : import('./ShowMobile'), { ssr: false })

interface Props {}

export const ActiveChatView = (props: Props) => {
  // Custom Hooks
  const {
    activeConversation,
    delegateCreateMessage,
    delegateDeleteMessage,
    goBack,
  } = useChat();
  const { user } = useAuth();
  const { sendAlert, sendInfo } = useAlert();
  const { emitter } = useEmitter();

  // Local State
  const [messageText, setMessageText] = useState("");
  const [userIsOnline, setUserIsOnline] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [canPingUserTyping, setCanPingUserTyping] = useState(true);
  const [loading, setLoading] = useState(true);
  let userStoppedTypingInterval = null;
  let canPingUserTypingInterval = null;

  // Refs
  const chatBoxRef = useRef<HTMLTextAreaElement>();
  const sendButtonRef = useRef<HTMLButtonElement>();
  const messagesEndRef = useRef<HTMLDivElement>();

  // Methods
  const sendMessage = async () => {
    // Call the delegate function to actually send the message
    await delegateCreateMessage(messageText, activeConversation.userId);
    setMessageText("");

    // TODO implement the show-mobile check here
    // chatBoxRef.current?.focus();
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const deleteMessage = async (messageId: number) => {
    // Call the delegate function to actually delete the message
    await delegateDeleteMessage(messageId);
  };

  const handleUserIsOnline = ({
    body,
  }: WSMessage<ChatUserOnlineResponseBody>) => {
    // Only set the state of user online if it is the active user we are chatting with
    if (body.userId === activeConversation.userId) {
      setUserIsOnline(body.isOnline);
      setLoading(false);
    }
  };

  const handleUserIsTyping = (message: WSMessage<any>) => {
    // console.log("User is typing? ", message);
    setUserIsTyping(true);

    if (userStoppedTypingInterval) {
      clearInterval(userStoppedTypingInterval);
    }

    userStoppedTypingInterval = setTimeout(() => {
      setUserIsTyping(false);
    }, 1100);
  };

  const handleTypingEvent = (e) => {
    setMessageText(e.currentTarget.value);

    // Prevent spamming of websocket message every key event
    if (!canPingUserTyping) return;
    setCanPingUserTyping(false);
    WSC.waitForSocketConnection((socket: WebSocket) => {
      // notify the server that we are online...
      const message: WSMessage<{ userId: number }> = {
        action: "chat.user.typing",
        body: { userId: activeConversation.userId },
      };
      socket.send(JSON.stringify(message));
    });
    canPingUserTypingInterval = setTimeout(() => {
      setCanPingUserTyping(true);
    }, 1000);
  };

  // Lifecycle Methods
  useEffect(() =>
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" }),
  );

  useEffect(() => {
    // Check if there is a saved message
    chatBoxRef.current?.focus();
    if (localStorage) {
      try {
        const savedMessageConvoId = JSON.parse(
          localStorage.getItem("activeConversation"),
        );
        if (
          savedMessageConvoId &&
          savedMessageConvoId === activeConversation.userId
        ) {
          const savedMessage = localStorage.getItem("messageText");
          savedMessage && setMessageText(savedMessage);
          chatBoxRef.current?.focus();
          // Clear the saved message
          localStorage.removeItem("messageText");
          localStorage.removeItem("activeConversation");
        }
      } catch (error) {}
    }

    // Clear any previous event listeners
    emitter.off("chat.user.online", handleUserIsOnline);
    emitter.off("chat.user.typing", handleUserIsTyping);

    // listen for the current user coming online and typing
    emitter.on("chat.user.online", handleUserIsOnline);
    emitter.on("chat.user.typing", handleUserIsTyping);

    WSC.waitForSocketConnection((socket: WebSocket) => {
      // Check if our conversation user is online as well...
      const message: WSMessage<{ userId: number }> = {
        action: "chat.user.online",
        body: { userId: activeConversation.userId },
      };
      socket.send(JSON.stringify(message));
    });

    return () => {
      try {
        emitter.off("chat.user.online", handleUserIsOnline);
        emitter.off("chat.user.typing", handleUserIsTyping);
        clearInterval(userStoppedTypingInterval);
        clearInterval(canPingUserTypingInterval);
      } catch (error) {
        // error
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full justify-between h-5/6">
      <BackToConversationsButton />
      <div className="flex flex-col justify-between h-full">
        <div className="h-auto overflow-y-auto">
          {/* Message to me */}

          {activeConversation.messages.map((message) => {
            // THere is a bug that causes message to be undefined here...
            // Only when sending the second message to a new message convo
            if (!message) return;
            if (message.userFromId === user.id) {
              // Message we sent
              return (
                <div
                  key={message.id}
                  className="flex justify-end text-white group"
                >
                  <div className="flex flex-col self-start bg-gray-600 rounded-md m-4 p-2 shadow-md">
                    <div className="text-md whitespace-pre-line">
                      {message.content}
                    </div>
                    <span
                      className="text-xs mt-1"
                      title={`${dateFormat(message.createdAt)} ${timeFormat(
                        message.createdAt,
                      )}`}
                    >
                      {timeFromNow(message.createdAt)}
                    </span>
                  </div>
                  <div className="flex-shrink-0 flex-grow-0 mr-4 self-center">
                    <svg
                      onClick={async (e) => await deleteMessage(message.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      className=" h-6 w-6 text-gray-800 hover:text-red-700 self-center cursor-pointer "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                </div>
              );
            } else {
              // Message we received
              return (
                <div key={message.id} className="flex justify-self-stretch">
                  <div className="flex flex-col self-start bg-lightBlue-300 rounded-md m-4 p-2 shadow-md">
                    <div className="text-md whitespace-pre-line">
                      {message.content}
                    </div>
                    <span
                      className="text-xs mt-1"
                      title={`${dateFormat(message.createdAt)} ${timeFormat(
                        message.createdAt,
                      )}`}
                    >
                      {timeFromNow(message.createdAt)}
                    </span>
                  </div>
                </div>
              );
            }
          })}
          {/* {userIsTyping && (
            <div className="flex justify-self-stretch">
              <div className="flex flex-col self-start bg-lightBlue-300 rounded-md m-4 p-2 shadow-md animate-pulse ">
                <div className="text-md whitespace-pre-line">
                  {`${formatUsername(
                    activeConversation.username,
                  )} is typing...`}
                </div>
                <span className="text-xs mt-1"></span>
              </div>
            </div>
          )} */}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex flex-col justify-center items-stretch border-t-2 w-full">
          <div className="flex w-full py-2 justify-between items-center">
            <span className="tracking-wide text-sm text-lightBlue-500 font-semibold">
              {userIsTyping
                ? `${formatUsername(activeConversation.username)} is typing...`
                : ""}
            </span>
            <span className="tracking-wide text-sm text-lightBlue-500 font-semibold">
              {loading
                ? `Checking status for ${formatUsername(
                    activeConversation.username,
                  )}`
                : `${formatUsername(activeConversation.username)} is ${
                    userIsOnline ? "Online" : "Offline"
                  }`}
            </span>
          </div>
          <div className="flex h-24">
            <textarea
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey) {
                  // manually focus on the send button
                  // ! This is only an issue on safari so far...
                }
              }}
              tabIndex={1}
              name="messageText"
              id=""
              className="w-full h-full px-4 py-2"
              value={messageText}
              onChange={handleTypingEvent}
              ref={chatBoxRef}
            ></textarea>
            <Button
              disabled={messageText.length === 0}
              tabIndex={2}
              className="w-max px-4"
              color="green"
              onClick={sendMessage}
              addMargins={false}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
