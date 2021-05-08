import { Dispatch, SetStateAction } from "react";
import { Conversation, Conversations } from "./Messages";
import { User } from "./User";

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

export interface ChatUserOnlineResponseBody {
  isOnline: boolean;
  username?: string;
  userId?: number;
}
