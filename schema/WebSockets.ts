type WSAction =
  | "auth.required"
  | "chat.message.new"
  | "chat.message.deleted"
  | "chat.user.online"
  | "chat.user.typing"
  | "followers.followed"
  | "followers.unfollowed"
  | "comments.count.new"
  | "comments.count.deleted"
  | "comments.new"
  | "comments.updated"
  | "comments.deleted"
  | "comments.likes.changed"
  | "tweets.likes.changed";

interface WSMessageError {
  message: string;
  code: number;
}
export interface WSMessage<T> {
  action: WSAction;
  status?: number; //? Shouldn't have status here since it isn't a response....
  body?: T | null;
  error?: WSMessageError;
}

export interface WSResponse<T> {
  action: WSAction;
  status?: number;
  body?: T | null;
  error?: WSMessageError;
}

export type EmitterCallback = (message: WSMessage<any>) => void;

export type WSSubscription = Map<WSAction, EmitterCallback>;
