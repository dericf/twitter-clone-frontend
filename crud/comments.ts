import { APIResponseError, responseDidSucceed } from "../schema/API";
import {
  CommentUpdateRequestBody,
  CommentUpdateResponse,
  CommentCreateResponse,
  CommentCreateRequestBody,
  CommentDeleteRequestBody,
  CommentDeleteResponse,
  Comment,
  CommentResponse,
} from "../schema/Comments";
import { EmptyResponse } from "../schema/General";

export const getAllCommentsForTweet = async (
  tweetId: number = null,
): Promise<CommentResponse> => {
  // Base URL
  let url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/tweet/${tweetId}`,
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
    const json: Array<Comment> = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const getAllCommentsForUser = async (
  userId: number = null,
): Promise<CommentResponse> => {
  // Base URL
  let url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/user/${userId}`,
  );

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
    const json: Array<Comment> = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const createNewComment = async (
  tweetId: number,
  content: string,
): Promise<CommentCreateResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      content: content,
      tweetId: tweetId,
    } as CommentCreateRequestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Comment = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const updateComment = async (
  newContent: string,
  commentId: number,
): Promise<CommentUpdateResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      newContent,
      commentId,
    } as CommentUpdateRequestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Comment = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};

export const deleteComment = async (
  commentId: number,
): Promise<CommentDeleteResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      commentId,
    } as CommentDeleteRequestBody),
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: EmptyResponse = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: new APIResponseError(res),
    };
  }
};
