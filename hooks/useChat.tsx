// React
import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  Ref,
  useRef,
} from "react";

// Next JS
import { useRouter } from "next/router";

// Hooks
import { useAlert } from "./useAlert";
import { useAuth } from "./useAuth";
import { useEmitter } from "./useEmitter";

// CRUD
import { createNewMessage, deleteMessage } from "../crud/messages";

// Schema
import {
  Tweet,
  TweetCreateRequestBody,
  TweetUpdateRequestBody,
} from "../schema/Tweet";
import { Conversation, Conversations, Message } from "../schema/Messages";
import { User } from "../schema/User";

export interface ChatContextI {
  conversations: Conversations;
  setConversations: (_: Conversations) => void;
  selectedUser: User;
  setSelectedUser: (_: User) => void;
  delegateDeleteMessage: (_: number) => void;
  delegateCreateMessage: (_: string, __: number) => void;
  activeConversation: Conversation;
  setActiveConversation: (_: Conversation) => void;
  showChatModal: boolean;
  setShowChatModal: (_: boolean) => void;
  goBack: () => void;
  closeModal: () => void;
}

export const ChatContext = createContext({} as ChatContextI);

export default function ChatContextProvider({ children }) {
  // Auth context
  const { user } = useAuth();

  // Toast notifications
  const { sendAlert, sendError } = useAlert();

  // Next router
  const router = useRouter();

  const { emitter } = useEmitter();

  //
  // Initialize Store State
  //
  const [conversations, setConversations] = useState<Conversations>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation>(
    null,
  );
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User>(null);

  const delegateDeleteMessage = async (messageId: number) => {
    /**
     * Call the backend to persist the deletion
     * then optimistically update the UI
     */
    const { value, error } = await deleteMessage(messageId);
    if (error) throw new Error(error.errorMessageUI);

    // Update state
    let newMessages = activeConversation.messages.filter(
      (message) => message.id !== messageId,
    );
    setActiveConversation({ ...activeConversation, messages: newMessages });

    let convoId = activeConversation.userId;

    let updatedConvos = { ...conversations };

    updatedConvos[convoId].messages = updatedConvos[convoId]?.messages?.filter(
      (message) => message.id !== messageId,
    );

    // Check if we've deleted the last message in the conversation
    // If so - remove the conversation
    if (updatedConvos[convoId]?.messages.length === 0) {
      delete updatedConvos[convoId];
    }
    setConversations(updatedConvos);
  };
  const delegateCreateMessage = async (content: string, toUserId: number) => {
    /**
     * Call the backend to persist the new message
     * then optimistically update the UI
     */
    const { value: newMessage, error } = await createNewMessage(
      toUserId,
      content,
    );
    // console.log("before", activeConversation);
    setActiveConversation({
      ...activeConversation,
      messages: [...(activeConversation?.messages || []), newMessage],
    });

    let updatedMessages: Message[];
    if (!conversations[toUserId]) {
      // This is the first message for this conversation
      updatedMessages = [newMessage];
      setConversations({
        ...conversations,
        [toUserId]: {
          messages: updatedMessages,
          userId: toUserId,
          username: "",
        },
      });
    } else {
      updatedMessages = [
        ...(conversations[toUserId].messages || []),
        newMessage,
      ];
      setConversations({
        ...conversations,
        [toUserId]: { ...conversations[toUserId], messages: updatedMessages },
      });
    }
  };

  const goBack = () => {
    // This goes back to the conversation list within the modal
    setActiveConversation(null);
  };

  const closeOnEscape = async (e) => {
    // Closes the modal when escape key is pressed
    if (e.key === "Escape") {
      setShowChatModal(false);
    }
  };

  const closeModal = () => {
    setShowChatModal(false);
  };

  // On modal shown
  useEffect(() => {
    if (document && showChatModal) {
      document?.addEventListener("keydown", closeOnEscape, false);
    }

    return () => {
      if (document)
        document?.removeEventListener("keydown", closeOnEscape, false);
    };
  }, [showChatModal]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        setConversations,
        activeConversation,
        setActiveConversation,
        delegateCreateMessage,
        delegateDeleteMessage,
        showChatModal,
        setShowChatModal,
        goBack,
        selectedUser,
        setSelectedUser,
        closeModal,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  return ctx;
};
