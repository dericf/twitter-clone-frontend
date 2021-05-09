import { APIResponse } from "./API";
import { EmptyResponse } from "./General";

export interface CommentLike {
  id: number;
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

export type CommentLikeResponse = APIResponse<CommentLike[]>;
export type CommentLikeCreateResponse = APIResponse<CommentLike>;
export type CommentLikeDeleteResponse = APIResponse<EmptyResponse>;

export interface WSCommentLikeUpdate {
  commentLike: CommentLike;
  isLiked: boolean;
}
