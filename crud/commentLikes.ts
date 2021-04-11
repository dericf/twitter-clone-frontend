import { APIResponseError, responseDidSucceed } from "../schema/API";
import { EmptyResponse } from "../schema/General";
import {
  CommentLike,
  CommentLikeCreateRequestBody,
  CommentLikeDeleteRequestBody,
  CommentLikeResponse,
} from "../schema/CommentLike";

export const getAllCommentLikes = async (
  commentId: number = null,
): Promise<CommentLikeResponse> => {
  // Base URL
  let url = new URL("http://localhost:8001/comment-likes");

  // Include optional search params if present
  if (commentId) {
    url.searchParams.set("commentId", commentId.toString());
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
  if (responseDidSucceed(res.status)) {
    const json: Array<CommentLike> = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const createNewCommentLike = async (
  requestBody: CommentLikeCreateRequestBody,
): Promise<EmptyResponse> => {
  try {
    const res = await fetch(`http://localhost:8001/comment-likes/`, {
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

export const deleteCommentLike = async (
  requestBody: CommentLikeDeleteRequestBody,
): Promise<EmptyResponse> => {
  try {
    const res = await fetch(`http://localhost:8001/comment-likes/`, {
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
