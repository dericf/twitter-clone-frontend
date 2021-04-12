import { APIResponse } from "./API";
import { EmptyResponse } from "./General";

export interface Tweet {
  tweetId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

export interface TweetCreateRequestBody {
  content: string;
}

export interface TweetUpdateRequestBody {
  newContent: string;
}

export type TweetResponse = APIResponse<Array<Tweet>>;
export type TweetCreateResponse = APIResponse<Tweet>;
export type TweetUpdateResponse = APIResponse<EmptyResponse>;
export type TweetDeleteResponse = APIResponse<EmptyResponse>;
