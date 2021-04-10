import { DEFAULT_TWEET_LIMIT } from "../constants/constants";
import {
  APIResponse,
  errorTextFromStatusCode,
  responseDidSucceed,
} from "../schema/API";
import {
  Tweet,
  TweetCreateRequestBody,
  TweetCreateResponse,
  TweetDeleteResponse,
  TweetResponse,
  TweetUpdateRequestBody,
  TweetUpdateResponse,
} from "../schema/Tweet";
import { getAllTweetLikes } from "./likes";

export const getSingleTweetById = async (
  tweetId: number = null,
): Promise<APIResponse<Tweet>> => {
  let url = new URL(`http://localhost:8001/tweets/one/${tweetId}`);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Tweet = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};

export const getAllTweets = async (
  userId = null,
  skip: number = 0,
): Promise<TweetResponse> => {
  let url = new URL("http://localhost:8001/tweets");

  // Include Skip (for pagination)
  url.searchParams.set("skip", skip.toString());

  // Include Limit
  url.searchParams.set("limit", DEFAULT_TWEET_LIMIT.toString());

  // Include optional search params if present
  if (userId) {
    url.searchParams.set("userId", userId.toString());
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Array<Tweet> = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};

export const createNewTweet = async (
  requestBody: TweetCreateRequestBody,
): Promise<TweetCreateResponse> => {
  const res = await fetch(`http://localhost:8001/tweets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(requestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Tweet = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};

export const updateTweet = async (
  requestBody: TweetUpdateRequestBody,
  tweetId: number,
): Promise<TweetUpdateResponse> => {
  const res = await fetch(`http://localhost:8001/tweets/${tweetId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(requestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Tweet = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};

export const deleteTweet = async (
  tweetId: number,
): Promise<TweetDeleteResponse> => {
  const res = await fetch(`http://localhost:8001/tweets/${tweetId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: TweetDeleteResponse = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};

export const getLikedTweets = async (
  skip: number = 0,
): Promise<TweetResponse> => {
  let url = new URL(`http://localhost:8001/tweets/liked`);

  // Include Skip (for pagination)
  url.searchParams.set("skip", skip.toString());

  // Include Limit
  url.searchParams.set("limit", DEFAULT_TWEET_LIMIT.toString());

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Array<Tweet> = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};
