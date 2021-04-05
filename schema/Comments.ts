import { EmptyResponse } from "./General";

export interface Comment {
  id: number;
  userId: number;
  tweetId: number;
  content: string;
}

export type CommentResponse = Array<Comment>;

export interface CommentCreateRequestBody {
  content: string;
  tweetId: number;
}

export interface CommentCreateResponse extends Comment {}

export interface CommentUpdateRequestBody {
  commentId: number;
  newContent: string;
}

export interface CommentUpdateResponse extends Comment {}

export interface CommentDeleteRequestBody {
  commentId: number;
}

export interface CommentDeleteResponse extends EmptyResponse {
  // Empty Response	for 200
}
