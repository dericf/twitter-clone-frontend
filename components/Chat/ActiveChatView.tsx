// React
import {
  LegacyRef,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";

// Utils
import { timeFromNow } from "../../utilities/dates";

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

  // Methods
  const sendMessage = async () => {
    // Call the delegate function to actually send the message
    await delegateCreateMessage(messageText, activeConversation.userId);
    setMessageText("");
    // Put focus back on the chat message textarea
    chatBoxRef.current?.focus();
  };

  const deleteMessage = async (messageId: number) => {
    // Call the delegate function to actually delete the message
    await delegateDeleteMessage(messageId);
  };

  // Lifecycle Methods
  // TODO: Add logic to always scroll to the bottom when a new message is added

  return (
    <div className="flex flex-col w-full justify-between h-5/6">
      <div
        className="flex justify-start self-start w-full max-h-full px-8 text-trueGray-900 cursor-pointer"
        onClick={() => goBack()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Conversations
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="h-auto overflow-y-auto">
          {/* Message to me */}

          {activeConversation.messages.map((message) => {
            if (message.userFromId === user.id) {
              // Message we sent
              return (
                <div
                  key={message.id}
                  className="flex justify-end text-white group shadow-md"
                >
                  <div className="flex flex-col self-start bg-gray-600 rounded-md m-4 p-2">
                    <div className="text-md">{message.content}</div>
                    <span className="text-xs mt-1">
                      {timeFromNow(message.createdAt)}
                    </span>
                  </div>
                  <svg
                    onClick={async (e) => await deleteMessage(message.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    className=" h-6 w-6 text-gray-800 self-center cursor-pointer mr-4"
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
              );
            } else {
              // Message we received
              return (
                <div
                  key={message.id}
                  className="flex justify-self-stretch shadow-md"
                >
                  <div className="flex flex-col self-start bg-lightBlue-200 rounded-md m-4 p-2">
                    <div className="text-md under">{message.content}</div>
                    <span className="text-xs mt-1">
                      {timeFromNow(message.createdAt)}
                    </span>
                  </div>
                </div>
              );
            }
          })}
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