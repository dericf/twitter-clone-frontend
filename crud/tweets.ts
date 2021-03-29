import { TweetResponse } from "../schema/Tweet";

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
    console.log("res.json :>> ", res.status);
    if (res.status >= 200 && res.status < 300) {
      const json: TweetResponse = await res.json();

      console.log("json :>> ", json);
      return json;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Caught error: ", error);
    return null;
  }
};
