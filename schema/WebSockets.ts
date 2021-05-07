type WSAction = "conversations.get.all" | "messages.new" | "messages.delete";

export interface WSMessage<T> {
  action: WSAction;
  status?: number;
  body?: T | null;
}

export interface WSResponse<T> {
  action: WSAction;
  status?: number;
  body?: T | null;
}

export type WSMessageCode = "messages.new" | "messages.deleted";

export type EmitterCallback = (message: WSMessage<any>) => void;

export type WSSubscription = Map<WSMessageCode, EmitterCallback>;
