import {
  APIResponse,
  APIResponseError,
  responseDidSucceed,
} from "../schema/API";
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
  let url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/follows/${userId}`);

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
      error: new APIResponseError(res),
    };
  }
};

export const createNewFollow = async (
  requestBody: FollowsCreateRequestBody,
): Promise<APIResponse<EmptyResponse>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follows`, {
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
      error: new APIResponseError(res),
    };
  }
};

export const deleteFollow = async (
  requestBody: FollowsDeleteRequestBody,
): Promise<APIResponse<EmptyResponse>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follows`, {
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
      error: new APIResponseError(res),
    };
  }
};
