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

//  import {
// 	 getAllTweetLikes,
// 	 createNewTweetLike,
// 	 deleteTweetLike,
//  } from "../../crud/likes";
import { useAuth } from "../../hooks/useAuth";
import { TweetLike } from "../../schema/Likes";
import {
  createNewFollow,
  deleteFollow,
  getAllFollows,
} from "../../crud/follows";
import { Follows } from "../../schema/Follows";
import { useStore } from "../../hooks/useStore";

interface PropType extends JSX.IntrinsicAttributes {
  followUserId: number;
}

export const FollowButton: FunctionComponent<PropType> = ({
  followUserId,
  ...props
}) => {
  const { user } = useAuth();
  const { follows, setFollows } = useStore();

  const router = useRouter;
  const [loading, setLoading] = useState(true);
  const [isFollowedByUser, setIsFollowedByUser] = useState(false);
  // const [follows, setFoll] = useState<Array<Follows>>([]);

  useEffect(() => {
    // On component load - get all the followers
    (async () => {
      let isFollowed = false;

      follows.forEach((follow) => {
        if (follow.userId === followUserId) {
          isFollowed = true;
        }
      });
      setIsFollowedByUser(isFollowed);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    let isFollowed = false;
    follows.forEach((follow) => {
      if (follow.userId === followUserId) {
        isFollowed = true;
      }
    });
    setIsFollowedByUser(isFollowed);
    setLoading(false);
  }, [follows]);

  const unfollowUser = async () => {
    //
    // Unlike the tweet
    //
    const { value, error } = await deleteFollow({ followUserId });
    if (error) return;
    //
    // Changes button state
    //
    setIsFollowedByUser(false);
    //
    // remove this user from our follows list
    //
    setFollows(follows.filter((follow) => follow.userId !== followUserId));
  };

  const followUser = async () => {
    //
    // Like the tweet
    //
    const { value, error } = await createNewFollow({ followUserId });

    if (error) return;

    const newFollow: Follows = {
      userId: followUserId,
      username: "",
      email: "",
      bio: "",
      birthdate: "",
    };
    //
    // Update list of follows to include the new one
    //
    setFollows([...follows, newFollow]);
    //
    // Changes button state
    //
    setIsFollowedByUser(true);
  };

  const handleClick = async () => {
    if (isFollowedByUser === true) {
      await unfollowUser();
    } else {
      await followUser();
    }
  };

  return loading === true ? (
    <Button className="ml-0" color="blue" disabled>
      <LoadingSpinner />
    </Button>
  ) : (
    <Button
      className="ml-0 sm:min-w-min border-none hover:animate-pulse"
      color={isFollowedByUser ? "blue" : "white"}
      title="Like Tweet"
      onClick={handleClick}
    >
      {/* ({tweetIsLikedByUser && <span>Is Liked</span>}) */}
      {isFollowedByUser === true ? (
        <span className="flex justify-between">
          <svg
            className="h-6 w-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
          </svg>
          <span className="hidden sm:inline">Unfollow</span>
        </span>
      ) : (
        <span className="flex justify-between">
          <svg
            className="h-6 w-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          <span className="hidden sm:inline">Follow</span>
        </span>
      )}
    </Button>
  );
};
