import { UserNotAuthenticatedError } from "../schema/Errors";
import { EmptyResponse } from "../schema/General";
import {
  TweetCreateRequestBody,
  TweetResponse,
  TweetUpdateRequestBody,
} from "../schema/Tweet";
import { getAllTweetLikes } from "./likes";

export const getAllTweets = async (
  userId = null,
  limit: number = null,
): Promise<TweetResponse> => {
  let url = new URL("http://localhost:8001/tweets");

  // Include optional search params if present
  if (userId) {
    url.searchParams.set("userId", userId.toString());
  }
  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }
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
      const json: TweetResponse = await res.json();

      // console.log("json :>> ", json);
      return json;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Caught error: ", error);
    return null;
  }
};

export const createNewTweet = async (
  requestBody: TweetCreateRequestBody,
): Promise<EmptyResponse> => {
  try {
    const res = await fetch(`http://localhost:8001/tweets/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(requestBody),
      credentials: "include",
    });
    if (res.status >= 200 && res.status < 300) {
      const json: EmptyResponse = await res.json();
      return json;
    } else {
      // Non-200 response
      return null;
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    return null;
  }
};

export const updateTweet = async (
  requestBody: TweetUpdateRequestBody,
  tweetId: number,
): Promise<EmptyResponse> => {
  try {
    const res = await fetch(`http://localhost:8001/tweets/${tweetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(requestBody),
      credentials: "include",
    });
    if (res.status >= 200 && res.status < 300) {
      const json: EmptyResponse = await res.json();
      return json;
    } else {
      // Non-200 response
      if (res.status === 403) {
        throw new UserNotAuthenticatedError("Not Logged In");
      }
      return null;
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    throw error;
  }
};

export const deleteTweet = async (tweetId: number): Promise<EmptyResponse> => {
  try {
    const res = await fetch(`http://localhost:8001/tweets/${tweetId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
    });
    if (res.status >= 200 && res.status < 300) {
      const json: EmptyResponse = await res.json();
      return json;
    } else {
      // Non-200 response
      return null;
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    return null;
  }
};

export const getAllLikedTweets = async (
  userId = null,
): Promise<TweetResponse> => {
  await getAllTweetLikes();
  try {
    const res = await fetch(`http://localhost:8001/tweets/liked`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    // console.log("res.json :>> ", res.status);
    if (res.status >= 200 && res.status < 300) {
      const json: TweetResponse = await res.json();

      // console.log("json :>> ", json);
      return json;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Caught error: ", error);
    return null;
  }
};
