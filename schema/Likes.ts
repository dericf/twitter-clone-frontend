import { APIResponse } from "./API";

export interface TweetLike {
  username: string;
  userId: number;
  tweetId: number;
}

export type TweetLikeResponse = APIResponse<Array<TweetLike>>;

export interface TweetLikeCreateRequestBody {
  tweetId: number;
}

export interface TweetLikeDeleteRequestBody {
  tweetId: number;
}
