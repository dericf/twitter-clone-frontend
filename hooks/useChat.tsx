// React
import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";

// Next JS
import { useRouter } from "next/router";

// Hooks
import { useAlert } from "./useAlert";
import { useAuth } from "./useAuth";
import { useEmitter } from "./useEmitter";

// CRUD
import {
  createNewMessage,
  deleteMessage,
  getAllMessages,
} from "../crud/messages";

// Schema
import {
  Conversation,
  Conversations,
  Message,
  MessageDeleteRequestBody,
  MessageDeleteWSAlert,
} from "../schema/Messages";
import { User } from "../schema/User";
import { WSMessage } from "../schema/WebSockets";

// Utils
import {
  getConversationUserId,
  getConversationUsername,
  groupMessagesByConversation,
} from "../components/Chat/utils";
import { isEmpty } from "../utilities/objects";

// Websocket Client Singleton
import WSC from "../websocket/client";

export interface ChatContextI {
  conversations: Conversations;
  setConversations: Dispatch<SetStateAction<Conversations>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  newChatAlert: boolean;
  setNewChatAlert: Dispatch<SetStateAction<boolean>>;
  selectedUser: User;
  setSelectedUser: Dispatch<SetStateAction<User>>;
  delegateDeleteMessage: (_: number) => void;
  delegateCreateMessage: (_: string, __: number) => void;
  activeConversation: Conversation;
  setActiveConversation: Dispatch<SetStateAction<Conversation>>;
  showChatModal: boolean;
  setShowChatModal: Dispatch<SetStateAction<boolean>>;
  goBack: () => void;
  closeModal: () => void;
}

export const ChatContext = createContext({} as ChatContextI);

export default function ChatContextProvider({ children }) {
  // Auth context
  const { user } = useAuth();

  // Toast notifications
  const { sendAlert, sendError, sendInfo } = useAlert();

  // Next router
  const router = useRouter();

  const { emitter } = useEmitter();

  //
  // Initialize Store State
  //
  const [loading, setLoading] = useState(true);
  const [newChatAlert, setNewChatAlert] = useState(false);
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

    let convoId = activeConversation.userId;

    // Update state
    setActiveConversation((prev) => {
      let newMessages = prev.messages.filter(
        (message) => message.id !== messageId,
      );
      return { ...prev, messages: newMessages };
    });

    setConversations((prev) => {
      let updatedConvos = { ...prev };

      updatedConvos[convoId].messages = updatedConvos[
        convoId
      ]?.messages?.filter((message) => message.id !== messageId);

      // Check if we've deleted the last message in the conversation
      // If so - remove the conversation
      if (updatedConvos[convoId]?.messages.length === 0) {
        delete updatedConvos[convoId];
      }
      return updatedConvos;
    });
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
    setActiveConversation((prev) => {
      if (conversations[toUserId]) {
        return {
          userId: toUserId,
          username: getConversationUsername(newMessage, user.id),
          messages: [...(conversations[toUserId].messages || []), newMessage],
        };
      } else {
        return {
          ...prev,
          messages: [...(prev?.messages || []), newMessage],
        };
      }
    });

    let updatedMessages: Message[];
    if (!conversations[toUserId]) {
      // This is the first message for this conversation
      setConversations((prev) => {
        updatedMessages = [newMessage];
        return {
          ...prev,
          [toUserId]: {
            messages: updatedMessages,
            userId: toUserId,
            username: "",
          },
        };
      });
    } else {
      setConversations((prev) => {
        updatedMessages = [...(prev[toUserId].messages || []), newMessage];
        return {
          ...prev,
          [toUserId]: { ...prev[toUserId], messages: updatedMessages },
        };
      });
    }
  };

  const goBack = () => {
    // This goes back to the conversation list within the modal
    setActiveConversation(null);
  };

  const closeModal = () => {
    setShowChatModal(false);
  };

  const newMessageAlert = ({ body: message }: WSMessage<Message>) => {
    setNewChatAlert(true);
    sendInfo(
      `You have a new message from @${message.userFromUsername.toUpperCase()}`,
    );
    let convoId = getConversationUserId(message, user.id);
    // Check if this is the very first message the user receives
    if (!conversations) {
      setConversations({
        [convoId]: {
          userId: convoId,
          username: getConversationUsername(message, user.id),
          messages: [message],
        },
      });
    } else {
      // Add this message to the correct conversation
      setConversations((prev) => {
        let updatedConversations: Conversations = {
          ...prev,
          [convoId]: {
            userId: convoId,
            username: getConversationUsername(message, user.id),
            messages: [...(prev[convoId]?.messages || []), message],
          } as Conversation,
        };
        return { ...updatedConversations };
      });
    }
    // !Bug here sometimes activeConversatiosn is null when it shouldn't be...
    // Update the active conversation if there is one.
    if (activeConversation && activeConversation.userId === convoId) {
      setActiveConversation((prev) => {
        return {
          ...prev,
          messages: [...(prev?.messages || []), message],
        };
      });
    }
  };

  const deletedMessageAlert = (
    wsMessage: WSMessage<MessageDeleteWSAlert>,
    retries = 2,
  ) => {
    const { body } = wsMessage;
    let convoId = body.userId;
    let messageId = body.messageId;

    console.log("convoId", convoId);
    console.log("mesageId", messageId);

    if (!activeConversation && retries > 0) {
      setTimeout(() => {
        deletedMessageAlert(wsMessage, retries - 1);
      }, 500);
      return;
    }

    if (activeConversation.userId === convoId) {
      // Update state
      setActiveConversation((prev) => {
        let newMessages = prev.messages.filter(
          (message) => message.id !== messageId,
        );
        return { ...prev, messages: newMessages };
      });
    }

    setConversations((prev) => {
      let updatedConvos = { ...prev };
      console.log("convo...", updatedConvos);
      updatedConvos[convoId].messages = updatedConvos[
        convoId
      ]?.messages?.filter((message) => message.id !== messageId);

      // Check if we've deleted the last message in the conversation
      // If so - remove the conversation
      if (updatedConvos[convoId]?.messages.length === 0) {
        delete updatedConvos[convoId];
      }
      return updatedConvos;
    });
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    if (isEmpty(conversations)) {
      (async () => {
        const { value, error } = await getAllMessages(user.id);
        if (error) throw new Error(error.errorMessageUI);
        let grouped = groupMessagesByConversation(user.id, value);
        setConversations(grouped);
      })()
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    // Connect to the websocket
    // console.log("Is Websocket already connected? ", WSC.isAlreadyConnected());
    if (!WSC.isAlreadyConnected()) {
      // console.log("Connecting to Websocket...");
      WSC.connect(user.id, emitter);
    }
    // listen for new messages
    emitter.off("messages.new", newMessageAlert);
    emitter.on("messages.new", newMessageAlert);

    // listen for deleted messages
    emitter.off("messages.deleted", deletedMessageAlert);
    emitter.on("messages.deleted", deletedMessageAlert);

    return () => {
      // remove the listeners.
      emitter.off("messages.new", newMessageAlert);
      emitter.off("messages.deleted", deletedMessageAlert);
    };
  }, [user, conversations, activeConversation]);

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
        loading,
        setLoading,
        newChatAlert,
        setNewChatAlert,
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
