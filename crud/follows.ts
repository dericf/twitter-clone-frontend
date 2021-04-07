import { errorTextFromStatusCode, responseDidSucceed } from "../schema/API";
import {
  Follows,
  FollowsCreateRequestBody,
  FollowsDeleteRequestBody,
  FollowsResponse,
} from "../schema/Follows";
import { EmptyResponse } from "../schema/General";

export const getAllFollows = async (
  userId: number,
): Promise<FollowsResponse> => {
  // Base URL
  let url = new URL(`http://localhost:8001/follows/${userId}`);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (responseDidSucceed(res.status)) {
    const json: Array<Follows> = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};

export const createNewFollow = async (
  requestBody: FollowsCreateRequestBody,
): Promise<EmptyResponse> => {
  const res = await fetch(`http://localhost:8001/follows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(requestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Follows = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};

export const deleteFollow = async (
  requestBody: FollowsDeleteRequestBody,
): Promise<EmptyResponse> => {
  const res = await fetch(`http://localhost:8001/follows`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(requestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: EmptyResponse = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};
