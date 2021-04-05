import { UserNotAuthenticatedError } from "../schema/Errors";
import { APIErrorResponse, EmptyResponse } from "../schema/General";
import {
  User,
  UserDeleteRequestBody,
  UserResponse,
  UserUpdateRequestBody,
  UserUpdateResponse,
} from "../schema/User";

export const getUserById = async (userId: number): Promise<User> => {
  let url = new URL(`http://localhost:8001/users`);
  url.searchParams.set("userId", userId.toString());
  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    // console.log("res.json :>> ", res.status);
    if (res.status >= 200 && res.status < 300) {
      const userResponse: UserResponse = await res.json();
      if (userResponse.length === 0) return null;

      // Return single user object
      return userResponse[0];
    } else {
      const err: APIErrorResponse = await res.json();
      throw new Error(`There was an issue. ${err.detail}`);
    }
  } catch (error) {
    console.log("Caught error: ", error);
    return null;
  }
};

export const updateUser = async (
  body: UserUpdateRequestBody,
): Promise<UserUpdateResponse> => {
  // Update the authenticated user's details (bio and/or username)
  try {
    const res = await fetch(`http://localhost:8001/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (res.status >= 200 && res.status < 300) {
      return await res.json();
    } else {
      // Non-200 response
      const err: APIErrorResponse = await res.json();
      throw new Error(`Cannot update user. ${err.detail}`);
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    throw error;
  }
};

export const deleteUser = async (password: string): Promise<EmptyResponse> => {
  // User must be authenticated, but must also provide their password
  // for extra protection
  try {
    const res = await fetch(`http://localhost:8001/users/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ password } as UserDeleteRequestBody),
    });
    if (res.status >= 200 && res.status < 300) {
      const json: EmptyResponse = await res.json();
      return json;
    } else {
      // Non-200 response
      const err: APIErrorResponse = await res.json();
      throw new Error(`Cannot delete user. ${err.detail}`);
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    throw error;
  }
};
