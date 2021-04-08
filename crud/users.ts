import {
  APIResponse,
  errorTextFromStatusCode,
  responseDidSucceed,
} from "../schema/API";
import { UserNotAuthenticatedError } from "../schema/Errors";
import { APIErrorResponse, EmptyResponse } from "../schema/General";
import {
  User,
  UserDeleteRequestBody,
  UserDeleteResponse,
  UserResponse,
  UserUpdateRequestBody,
  UserUpdateResponse,
} from "../schema/User";

export const getUserById = async (
  userId: number,
): Promise<APIResponse<User>> => {
  let url = new URL(`http://localhost:8001/users`);
  url.searchParams.set("userId", userId.toString());
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
    const users: Array<User> = await res.json();
    return {
      value: users.length > 0 ? users[0] : null,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};

export const updateUser = async (
  body: UserUpdateRequestBody,
): Promise<UserUpdateResponse> => {
  // Update the authenticated user's details (bio and/or username)
  const res = await fetch(`http://localhost:8001/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: User = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};

export const deleteUser = async (
  password: string,
): Promise<UserDeleteResponse> => {
  // User must be authenticated, but must also provide their password
  // for extra protection

  const res = await fetch(`http://localhost:8001/users/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password } as UserDeleteRequestBody),
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
