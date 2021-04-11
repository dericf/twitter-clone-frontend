import { APIResponse } from "./API";
import { EmptyResponse } from "./General";

export interface CommentLike {
  username: string;
  userId: number;
  commentId: number;
}

export interface CommentLikeCreateRequestBody {
  commentId: number;
}

export interface CommentLikeDeleteRequestBody {
  commentId: number;
}

export type CommentLikeResponse = APIResponse<Array<CommentLike>>;
export type CommentLikeDeleteResponse = APIResponse<EmptyResponse>;
