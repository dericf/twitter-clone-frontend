import React, { useEffect, useState } from "react";
// NextJS
import Link from "next/link";

// Components
import { Tweet } from "../../schema/Tweet";
import { LikeButton } from "../Likes/LikeButton";
import { EditTweetButton } from "./EditTweetModal";
import { DeleteTweetModal } from "./DeleteTweetModal";
import { FollowButton } from "./FollowButton";
import { CommentList } from "../Comments/CommentList";

// UI Components
import { Button } from "../UI/Button";
import { dateFormat, timeFormat, timeFromNow } from "../../utilities/dates";
import { LoadingSpinner } from "../UI/LoadingSpinner";

// Custom Hooks
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "../../hooks/useAlert";

// Crud Methods
import {
  getCommentCountForTweet,
  getFollowersCount,
  getFollowsCount,
} from "../../crud/counts";

// Helper Methods
import { getRandomInt } from "../../utilities/randomNumbers";
interface Props {
  tweet: Tweet;
}

export const TweetCard = ({ tweet }: Props) => {
  const { isAuthenticated, user } = useAuth();
  const [showComments, setShowComments] = useState<boolean>(false);

  const [commentCount, setCommentCount] = useState<number>(null);
  const [followsCount, setFollowsCount] = useState<number>(null);
  const [followerCount, setFollowerCount] = useState<number>(null);
  const [commentCountChanged, setCommentCountChanged] = useState<boolean>(
    false,
  );

  const { sendError } = useAlert();

  const updateCommentCount = async () => {
    const { value, error } = await getCommentCountForTweet(tweet.tweetId);
    if (error) throw new Error(error.errorMessageUI);
    setCommentCount(value.count);
  };

  const updateFollowsCount = async () => {
    const {
      value: followsCountValue,
      error: followsCountError,
    } = await getFollowsCount(tweet.userId);
    if (followsCountError) throw new Error(followsCountError.errorMessageUI);
    setFollowsCount(followsCountValue.count);
  };

  const updateFollowersCount = async () => {
    const {
      value: followersCountValue,
      error: followersCountError,
    } = await getFollowersCount(tweet.userId);
    if (followersCountError)
      throw new Error(followersCountError.errorMessageUI);
    setFollowerCount(followersCountValue.count);
  };

  const updateCounts = async () => {
    try {
      await updateCommentCount();
      await updateFollowsCount();
      await updateFollowersCount();
    } catch (error) {
      sendError(error);
    }
  };

  const changeCommentState = async () => {
    setShowComments(!showComments);
    await updateCommentCount();
  };

  useEffect(() => {
    (async () => {
      await updateCounts();
    })().catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <div className="mx-auto my-6 w-full  sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl  bg-white rounded-sm shadow-md">
      <div className="flex">
        <div className="px-0 pt-4 flex-grow">
          <div className="flex justify-between items-center">
            <div className="flex flex-col px-4">
              <Link as={`/user/${tweet.userId}`} href={`/user/${tweet.userId}`}>
                <span className="cursor-pointer hover:text-lightBlue-700 uppercase tracking-wide text-sm text-lightBlue-500 font-semibold">
                  @{tweet.username} {tweet.userId == user?.id && <>{"(me)"}</>}
                </span>
              </Link>

              <span className="flex flex-1 items-center mt-1 text-xs text-trueGray-600">
                {timeFromNow(tweet.createdAt)}{" "}
                <span
                  className="cursor-default text-trueGray-500 hover:text-trueGray-700 ml-1"
                  title={`${timeFormat(tweet.createdAt)} on ${dateFormat(
                    tweet.createdAt,
                  )}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </span>
            </div>

            {user && (
              <div className="px-2 ">
                {user.id !== tweet.userId ? (
                  <FollowButton followUserId={tweet.userId} />
                ) : (
                  <div className="flex items-center justify-end flex-wrap">
                    <EditTweetButton tweet={tweet} />
                    <DeleteTweetModal tweetId={tweet.tweetId} />
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mt-2 flex-shrink max-w-lg lg:max-w-xl xl:max-w-2xl  text-blueGray-500 text-2xl px-4 py-4 overflow-hidden overflow-ellipsis whitespace-pre-line ">
            {tweet.content}
          </p>

          {isAuthenticated === true && (
            <div className="flex flex-col justify-center items-start mt-3 bg-blueGray-300 px-2 sm:px-4 py-2 ">
              <div className="flex space-x-4 w-full">
                {/* Like button */}
                <LikeButton tweetId={tweet.tweetId} />
                {/* Comments */}
                <Button
                  color="white"
                  title={showComments ? "Hide Comments" : "Show Comments"}
                  onClick={changeCommentState}
                  className={`${
                    commentCountChanged === true
                      ? "animate-bounce bg-warmGray-800 text-white"
                      : ""
                  }`}
                >
                  {showComments ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transform -translate-y-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>

                      {commentCount && (
                        <span className={`ml-1`}>{commentCount}</span>
                      )}
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                      {commentCount && <span>{commentCount}</span>}
                    </>
                  )}
                </Button>
                <div className="flex flex-grow space-x-4 flex-wrap justify-end items-center text-xs sm:text-sm text-lightBlue-900 text-semibold">
                  {followsCount === null || followerCount === null ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <span>Followers: {followerCount}</span>

                      <span>Following: {followsCount}</span>
                    </>
                  )}
                </div>
              </div>
              {showComments && <CommentList tweetId={tweet.tweetId} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
