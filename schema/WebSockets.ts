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
