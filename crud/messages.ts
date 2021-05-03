// Schema
import {
  APIResponse,
  APIResponseError,
  responseDidSucceed,
} from "../schema/API";

import { EmptyResponse } from "../schema/General";
import {
  Message,
  MessageCreateRequestBody,
  MessageCreateResponse,
  MessageDeleteRequestBody,
  MessageDeleteResponse,
  MessageUpdateRequestBody,
  MessageUpdateResponse,
} from "../schema/Messages";

export const getAllMessages = async (
  userId: number = null,
): Promise<APIResponse<Message[]>> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/messages`);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  // console.log("res.json :>> ", res.status);
  if (responseDidSucceed(res.status)) {
    const json: Message[] = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const createNewMessage = async (
  userToId: number,
  content: string,
): Promise<MessageCreateResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      content: content,
      userToId: userToId,
    } as MessageCreateRequestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Message = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const updateMessage = async (
  newContent: string,
  messageId: number,
): Promise<MessageUpdateResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      newContent,
      messageId,
    } as MessageUpdateRequestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Message = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const deleteMessage = async (
  messageId: number,
): Promise<MessageDeleteResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      messageId,
    } as MessageDeleteRequestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: EmptyResponse = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};
