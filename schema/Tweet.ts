export interface Tweet {
  tweetId: Number;
  userId: Number;
  username: String;
  content: String;
  createdAt: String;
}

export type TweetResponse = Array<Tweet>;

export interface TweetCreateRequestBody {
  content: String;
}
