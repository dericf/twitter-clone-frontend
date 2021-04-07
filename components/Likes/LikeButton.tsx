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
      const { value: likes, error } = await getAllTweetLikes(tweetId);
      setTweetLikes(likes);
      if (error) throw new Error(error);

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
      setTweetLikes([...tweetLikes.filter((like) => like.userId !== user.id)]);
    } else {
      // Like the tweet
      await createNewTweetLike({ tweetId });
      setTweetIsLikedByUser(true);
      setTweetLikes([
        ...tweetLikes,
        { tweetId: tweetId, userId: user.id, username: user.username },
      ]);
    }
  };

  return loading === true ? (
    <Button className="ml-0" color="white" disabled>
      <LoadingSpinner />
    </Button>
  ) : (
    <Button
      animated
      className={`ml-0 ${
        tweetIsLikedByUser
          ? "text-white "
          : "text-blueGray-700 hover:text-white"
      } `}
      color={tweetIsLikedByUser ? "blue" : "white"}
      title="Like Tweet"
      onClick={likeTweet}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
        />
      </svg>
      <span>{tweetLikes.length}</span>
      {/* ({tweetIsLikedByUser && <span>Is Liked</span>}) */}
    </Button>
  );
};
