import {
  APIResponse,
  APIResponseError,
  responseDidSucceed,
} from "../schema/API";
import { EmptyResponse } from "../schema/General";
import {
  CommentLike,
  CommentLikeCreateRequestBody,
  CommentLikeCreateResponse,
  CommentLikeDeleteRequestBody,
  CommentLikeDeleteResponse,
  CommentLikeResponse,
} from "../schema/CommentLike";

export const getAllCommentLikes = async (
  commentId: number = null,
): Promise<CommentLikeResponse> => {
  // Base URL
  let url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/comment-likes`);

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
): Promise<CommentLikeCreateResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment-likes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(requestBody),
    credentials: "include",
  });
  if (res.status >= 200 && res.status < 300) {
    const json: CommentLike = await res.json();
    return {
      value: json,
    };
  } else {
    // Non-200 response TODO: Throw custom error and make caller handle
    return {
      error: new APIResponseError(res),
    };
  }
};

export const deleteCommentLike = async (
  requestBody: CommentLikeDeleteRequestBody,
): Promise<CommentLikeDeleteResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment-likes/`, {
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
    return {
      value: json,
    };
  } else {
    // Non-200 response TODO: Throw custom error and make caller handle
    return {
      error: new APIResponseError(res),
    };
  }
};
