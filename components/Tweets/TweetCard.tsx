import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { Tweet } from "../../schema/Tweet";
import { dateFormat, timeFormat } from "../../utilities/dates";
import { LikeButton } from "../Likes/LikeButton";
import { Button } from "../UI/Button";
import { EditTweetButton } from "./EditTweetModal";
import { FollowButton } from "./FollowButton";
interface Props {
  tweet: Tweet;
}

export const TweetCard = ({ tweet }: Props) => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="mx-auto my-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl  bg-white rounded-sm shadow-md">
      <div className="flex ">
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
                  <EditTweetButton tweet={tweet} />
                )}
              </>
            )}
          </div>

          <span className="block mt-1 text-lg leading-tight font-medium text-black">
            {dateFormat(tweet.createdAt)} at {timeFormat(tweet.createdAt)}
          </span>

          <p className="mt-2 text-gray-500 text-2xl">{tweet.content}</p>
          {isAuthenticated === true && (
            <div className="flex">
              {/* Like button */}
              <LikeButton tweetId={tweet.tweetId} />

              {/* Comments */}
              <Button color="white" title="Show Comments">
                <svg
                  className="w-8 h-8 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
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
