import { APIResponse } from "./API";
import { EmptyResponse } from "./General";

export interface Comment {
  id: number;
  userId: number;
  tweetId: number;
  content: string;
  username: string;
  createdAt: string;
}

export interface CommentResponse extends APIResponse<Array<Comment>> {
  //
}

export interface CommentCreateRequestBody {
  content: string;
  tweetId: number;
}

export type CommentCreateResponse = APIResponse<Comment>;

export interface CommentUpdateRequestBody {
  commentId: number;
  newContent: string;
}

export interface CommentUpdateResponse extends APIResponse<Comment> {
  //
}
export interface CommentDeleteRequestBody {
  commentId: number;
}

export interface CommentDeleteResponse extends APIResponse<EmptyResponse> {
  //
}
