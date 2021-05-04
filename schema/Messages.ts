// API
import { APIResponse } from "./API";

// Schema
import { EmptyResponse } from "./General";

export interface Message {
  id: number;
  userFromId: number;
  userFromUsername: string;
  userToId: number;
  userToUsername: string;
  content: string;
  createdAt: Date;
}

export interface Conversation {
  username: string;
  userId: number;
  messages: Message[];
}

export interface Conversations {
  [userId: number]: Conversation;
}

export type ConversationsResponse = APIResponse<Conversations>;

export interface MessageCreateRequestBody {
  content: string;
  userToId: number;
}

export type MessageCreateResponse = APIResponse<Message>;

export interface MessageUpdateRequestBody {
  messageId: number;
  newContent: string;
}

export interface MessageUpdateResponse extends APIResponse<Message> {
  //
}

export interface MessageDeleteRequestBody {
  messageId: number;
}

export interface MessageDeleteResponse extends APIResponse<EmptyResponse> {
  //
}

export interface MessageDeleteWSAlert {
  messageId: number;
  userId: number;
}
