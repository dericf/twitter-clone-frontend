export interface TweetLike {
	username: string;
	userId: number;
	tweetId: number;
}

export type TweetLikeResponse = Array<TweetLike>