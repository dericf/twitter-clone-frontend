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
import { WSMessage, WSSubscription } from "../schema/WebSockets";

// Utils
import {
  getConversationUserId,
  getConversationUsername,
  groupMessagesByConversation,
} from "../components/Chat/utils";
import { isEmpty } from "../utilities/objects";

// Websocket Client Singleton
import WSC from "../websocket/client";
import { ChatContextI, ChatUserOnlineResponseBody } from "../schema/Chat";
import { formatUsername } from "../utilities/formating";

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
  const [userHasNoMessages, setUserHasNoMessages] = useState(false);

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
    if (error) {
      // User session has expired and needs to re-authenticate
      if (error.statusCode === 401) {
        localStorage.setItem("messageText", content);
        localStorage.setItem(
          "activeConversation",
          JSON.stringify(activeConversation.userId),
        );
        router.push(`/login?redirect=${router.asPath}`);
      }
    }
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
          username: getConversationUsername(newMessage, user.id),
          userId: toUserId,
          messages: [newMessage],
        };
      }
    });

    let updatedMessages: Message[];
    if (!conversations[toUserId]) {
      console.log("first message for this conversation");
      // This is the first message for this conversation
      setConversations((prev) => {
        updatedMessages = [newMessage];
        return {
          ...prev,
          [toUserId]: {
            messages: updatedMessages,
            userId: toUserId,
            username: getConversationUsername(newMessage, user.id),
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
    setSelectedUser(null);
    setShowChatModal(false);
  };

  const newMessageAlert = ({ body: message }: WSMessage<Message>) => {
    if (!activeConversation || !showChatModal) {
      setNewChatAlert(true);
      sendInfo(
        `You have a new message from @${message.userFromUsername.toUpperCase()}`,
      );
    }
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

  const deletedMessageAlert = (wsMessage: WSMessage<MessageDeleteWSAlert>) => {
    const { body } = wsMessage;
    let convoId = body.userId;
    let messageId = body.messageId;

    // if (!activeConversation && retries > 0) {
    //   setTimeout(() => {
    //     deletedMessageAlert(wsMessage, retries - 1);
    //   }, 500);
    //   return;
    // }
    if (!activeConversation) {
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

  const handleUserIsOnline = ({
    body,
  }: WSMessage<ChatUserOnlineResponseBody>) => {
    // console.log("User is online? ", message);
    body.username &&
      sendInfo(
        `${formatUsername(body.username)} is ${
          body.isOnline ? "Online" : "Offline"
        }`,
      );
  };
  const handleWSAuthRequired = (message: WSMessage<any>) => {
    // TODO: oNce the login modal is built - should just show modal instead of redirect
    router.push(`/login?redirect=${router.asPath}`);
  };
  //
  // Life Cycle
  //
  useEffect(() => {
    if (!user) {
      return;
    }
    if (isEmpty(conversations) && !userHasNoMessages) {
      (async () => {
        const { value, error } = await getAllMessages(user.id);
        if (error) throw new Error(error.errorMessageUI);
        if (value.length === 0) {
          // prevent from constantly querying for messages. Not the best solution but works for nwo
          setUserHasNoMessages(true);
        }
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

    const wsSubscriptions: WSSubscription = new Map();
    wsSubscriptions.set("auth.required", handleWSAuthRequired);
    wsSubscriptions.set("chat.message.new", newMessageAlert);
    wsSubscriptions.set("chat.message.deleted", deletedMessageAlert);
    wsSubscriptions.set("chat.user.online", handleUserIsOnline);
    //
    // Connect to the websocket
    // console.log("Is Websocket already connected? ", WSC.isAlreadyConnected());
    //
    if (!WSC.isAlreadyConnected()) {
      // console.log("Connecting to Websocket...");
      WSC.connect(user.id, emitter);
    }
    //
    // subscribe for new messages
    //
    wsSubscriptions.forEach((callback, code) => {
      emitter.off(code, callback);
      emitter.on(code, callback);
    });
    //
    // listen for deleted messages
    //
    return () => {
      // remove the listeners.
      wsSubscriptions.forEach((callback, code) => {
        emitter.off(code, callback);
      });
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
