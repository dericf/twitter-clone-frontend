import {
  TweetLikeCreateRequestBody,
  TweetLikeDeleteRequestBody,
  TweetLikeResponse,
} from "../schema/Likes";

export const getAllTweetLikes = async (
  tweetId: number = null,
): Promise<TweetLikeResponse> => {
  try {
    // Base URL
    let url = new URL("http://localhost:8001/tweet-likes");

    // Include optional search params if present
    if (tweetId) {
      url.searchParams.set("tweetId", tweetId.toString());
    }

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
      const json: TweetLikeResponse = await res.json();

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

export const createNewTweetLike = async (
  requestBody: TweetLikeCreateRequestBody,
): Promise<EmptyResponse> => {
  try {
    const res = await fetch(`http://localhost:8001/tweet-likes/`, {
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
      // Non-200 response TODO: Throw custom error and make caller handle
      return null;
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    return null;
  }
};

export const deleteTweetLike = async (
  requestBody: TweetLikeDeleteRequestBody,
): Promise<EmptyResponse> => {
  try {
    const res = await fetch(`http://localhost:8001/tweet-likes/`, {
      method: "DELETE",
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
      // Non-200 response TODO: Throw custom error and make caller handle
      return null;
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    return null;
  }
};
