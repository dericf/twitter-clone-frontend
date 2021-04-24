import { APIResponseError, responseDidSucceed } from "../schema/API";
import { Count, CountResponse } from "../schema/Counts";

export const getCommentCountForTweet = async (
  tweetId: number = null,
): Promise<CountResponse> => {
  // Base URL
  let url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/count/tweet/${tweetId}`,
  );

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Count = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const getFollowsCount = async (
  userId: number,
): Promise<CountResponse> => {
  // Base URL
  let url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/follows/count/${userId}`,
  );

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Count = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const getFollowersCount = async (
  userId: number,
): Promise<CountResponse> => {
  // Base URL
  let url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/followers/count/${userId}`,
  );

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Count = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};
