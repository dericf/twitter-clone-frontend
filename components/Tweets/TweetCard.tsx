import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { Tweet } from "../../schema/Tweet";
import { dateFormat, timeFormat } from "../../utilities/dates";
import { LikeButton } from "../Likes/LikeButton";
import { Button } from "../UI/Button";
import { EditTweetButton } from "./EditTweetModal";
import { DeleteTweetModal } from "./DeleteTweetModal";
import { FollowButton } from "./FollowButton";
import { useState } from "react";
import { CommentList } from "../Comments/CommentList";
interface Props {
  tweet: Tweet;
}

export const TweetCard = ({ tweet }: Props) => {
  const { isAuthenticated, user } = useAuth();
  const [showComments, setShowComments] = useState<boolean>(false);

  return (
    <div className="mx-auto my-6 w-full  sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl  bg-white rounded-sm shadow-md">
      <div className="flex">
        <div className="px-0 pt-4 flex-grow">
          <div className="flex justify-between items-center">
            <div className="flex flex-col px-4">
              <Link
                as={`/user/${tweet.userId}`}
                href={`/users/${tweet.userId}`}
              >
                <span className="cursor-pointer hover:text-lightBlue-700 uppercase tracking-wide text-sm text-lightBlue-500 font-semibold">
                  {tweet.username} {tweet.userId == user?.id && <>{"(me)"}</>}
                </span>
              </Link>
              <span className="block mt-1 text-sm leading-tight font-medium text-black">
                {dateFormat(tweet.createdAt)} at {timeFormat(tweet.createdAt)}
              </span>
            </div>

            {user && (
              <div className="px-2">
                {user.id !== tweet.userId ? (
                  <FollowButton followUserId={tweet.userId} />
                ) : (
                  <div className="flex items-center">
                    <EditTweetButton tweet={tweet} />
                    <DeleteTweetModal tweetId={tweet.tweetId} />
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mt-2 text-blueGray-500 text-2xl px-4 py-4">
            {tweet.content}
          </p>

          {isAuthenticated === true && (
            <div className="flex flex-col justify-center items-start mt-3 bg-blueGray-300 px-4 py-2 ">
              <div className="flex space-x-4">
                {/* Like button */}
                <LikeButton tweetId={tweet.tweetId} />

                {/* Comments */}
                <Button
                  color="white"
                  title={showComments ? "Hide Comments" : "Show Comments"}
                  onClick={() => setShowComments(!showComments)}
                >
                  {showComments ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
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
                  )}
                </Button>
              </div>
              {showComments && <CommentList tweetId={tweet.tweetId} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
