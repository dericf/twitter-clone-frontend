/**
 * This Component shows the button/icon for a user to "like" a tweet
 * It also shows how many likes the tweet currently has
 * The button will be highlighted a different color if the current user has already liked the tweet
 * If the user clicks the button and the tweet is currently already liked by them, it will unlike the tweet
 */

import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { Button } from "../UI/Button";

import {
  getAllTweetLikes,
  createNewTweetLike,
  deleteTweetLike,
} from "../../crud/likes";
import { useAuth } from "../../hooks/useAuth";
import { TweetLike } from "../../schema/Likes";

interface PropType extends JSX.IntrinsicAttributes {
  tweetId: number;
}

export const LikeButton: FunctionComponent<PropType> = ({
  tweetId,
  ...props
}) => {
  const { user } = useAuth();

  const router = useRouter;
  const [loading, setLoading] = useState(true);
  const [tweetIsLikedByUser, setTweetIsLikedByUser] = useState(false);
  const [tweetLikes, setTweetLikes] = useState<Array<TweetLike>>([]);

  useEffect(() => {
    (async () => {
      const likes = await getAllTweetLikes(tweetId);
      setTweetLikes(likes);
      // console.log("likes :>> ", likes);
      likes.forEach((like) => {
        if (like.userId === user.id) {
          setTweetIsLikedByUser(true);
        }
      });
      setLoading(false);
    })().catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const likeTweet = async () => {
    if (tweetIsLikedByUser === true) {
      // Unlike the tweet
      await deleteTweetLike({ tweetId });
      setTweetIsLikedByUser(false);
      setTweetLikes([...tweetLikes.filter(like => like.userId !== user.id)])
    } else {
      // Like the tweet
      await createNewTweetLike({ tweetId });
      setTweetIsLikedByUser(true);
      setTweetLikes([...tweetLikes, {tweetId: tweetId, userId: user.id, username: user.username}])
    }
  };

  return loading === true ? (
    <Button className="ml-0" color="white" disabled>
      <LoadingSpinner />
    </Button>
  ) : (
    <Button
      className={`ml-0 ${tweetIsLikedByUser ? "text-white " : "text-blueGray-700 hover:text-white"} `}
      color={tweetIsLikedByUser ?  "blue" : "white" }
      title="Like Tweet"
      onClick={likeTweet}
    >
      <svg
        className={`w-8 h-8 cursor-pointer `}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        >
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
      </svg>
        <span>{tweetLikes.length}</span>
       {/* ({tweetIsLikedByUser && <span>Is Liked</span>}) */}
    </Button>
  );
};
