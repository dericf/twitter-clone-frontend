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

// Utils
import { dateFormat, timeFormat, timeFromNow } from "../../utilities/dates";
import { BackToConversationsButton } from "./BackToConversationsButton";

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

  // Local State
  const [messageText, setMessageText] = useState("");

  // Refs
  const chatBoxRef = useRef<HTMLTextAreaElement>();
  const messagesEndRef = useRef<HTMLDivElement>();

  // Methods
  const sendMessage = async () => {
    // Call the delegate function to actually send the message
    await delegateCreateMessage(messageText, activeConversation.userId);
    setMessageText("");
    // ! remove re-focus on mobile Put focus back on the chat message textarea
    // TODO implement the show-mobile check here
    chatBoxRef.current?.focus();
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const deleteMessage = async (messageId: number) => {
    // Call the delegate function to actually delete the message
    await delegateDeleteMessage(messageId);
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
                  <div className="flex-shrink-0 flex-grow-0 mr-4">
                    <svg
                      onClick={async (e) => await deleteMessage(message.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      className=" h-6 w-6 text-gray-800 self-center cursor-pointer "
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
          <div ref={messagesEndRef} />
        </div>
        <div className="flex justify-center items-stretch border-t-2 h-24 w-full">
          <textarea
            name="messageText"
            id=""
            className="w-full h-full px-4 py-2"
            value={messageText}
            onChange={(e) => setMessageText(e.currentTarget.value)}
            ref={chatBoxRef}
          ></textarea>
          <button
            className="w-max px-4 bg-green-600 text-white"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
