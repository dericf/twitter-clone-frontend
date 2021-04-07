import { APIResponse } from "./API";
import { EmptyResponse } from "./General";

export interface Tweet {
  tweetId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

export type TweetResponse = APIResponse<Array<Tweet>>;

export interface TweetCreateRequestBody {
  content: string;
}

export type TweetCreateResponse = APIResponse<Tweet>;

export interface TweetUpdateRequestBody {
  newContent: string;
}

export type TweetUpdateResponse = APIResponse<EmptyResponse>;

export type TweetDeleteResponse = APIResponse<EmptyResponse>;
