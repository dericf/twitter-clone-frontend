import { TweetCreateRequestBody, TweetResponse, TweetUpdateRequestBody } from "../schema/Tweet";

export const getAllTweets = async (userId = null): Promise<TweetResponse> => {
  try {
    const res = await fetch(
      `http://localhost:8001/tweets/${
        userId ? "?userId=" + String(userId) : ""
      }`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
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
      return null;
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    return null;
  }
};


export const deleteTweet = async (
  tweetId: number,
): Promise<EmptyResponse> => {
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
