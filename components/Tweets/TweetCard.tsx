import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { Tweet } from "../../schema/Tweet";
import { dateFormat, timeFormat } from "../../utilities/dates";
import { LikeButton } from "../Likes/LikeButton";
import { Button } from "../UI/Button";
import { EditTweetButton } from "./EditTweetModal";
import { DeleteTweetModal } from "./DeleteTweetModal";
import { FollowButton } from "./FollowButton";
interface Props {
  tweet: Tweet;
}

export const TweetCard = ({ tweet }: Props) => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="mx-auto my-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl  bg-white rounded-sm shadow-md">
      <div className="flex">
        <div className="p-8 flex-grow">
          <div className="uppercase tracking-wide text-sm text-lightBlue-500 font-semibold flex justify-between items-center">
            <Link as={`/user/${tweet.userId}`} href={`/users/${tweet.userId}`}>
              <span className="cursor-pointer hover:text-lightBlue-700">
                {tweet.username} {tweet.userId == user?.id && <>{"(me)"}</>}
              </span>
            </Link>

            {user && (
              <>
                {user.id !== tweet.userId ? (
                  <FollowButton followUserId={tweet.userId} />
                ) : (
                  <div className="flex items-center">
                    <EditTweetButton tweet={tweet} />
                    <DeleteTweetModal tweetId={tweet.tweetId} />
                  </div>
                )}
              </>
            )}
          </div>

          <span className="block mt-1 text-lg leading-tight font-medium text-black">
            {dateFormat(tweet.createdAt)} at {timeFormat(tweet.createdAt)}
          </span>

          <p className="mt-2 text-blueGray-500 text-2xl">{tweet.content}</p>
          {isAuthenticated === true && (
            <div className="flex justify-start space-x-4 mt-3 bg-blueGray-300 px-4 py-2 rounded-sm">
              {/* Like button */}
              <LikeButton tweetId={tweet.tweetId} />

              {/* Comments */}
              <Button color="white" title="Show Comments">
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
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
