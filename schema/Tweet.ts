export interface Tweet {
  tweetId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

export type TweetResponse = Array<Tweet>;

export interface TweetCreateRequestBody {
  content: string;
}

export interface TweetUpdateRequestBody {
  newContent: string;
}