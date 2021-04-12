import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
import { Follows } from "../../schema/Follows";
import { useEffect, useState } from "react";
import { Tweet } from "../../schema/Tweet";
import { getAllTweets } from "../../crud/tweets";
import { TweetCard } from "../Tweets/TweetCard";
import { Button } from "../UI/Button";
import { useRouter } from "next/router";

interface Props {
  follow: Follows;
}

export const FollowCard = (props: Props) => {
  const { follow } = props;
  const router = useRouter();
  const { user } = useAuth();

  const [userTweets, setUserTweets] = useState<Array<Tweet>>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { value, error } = await getAllTweets(follow.userId);
      if (error) throw new Error(error.errorMessageUI);
      setUserTweets(value);
    })().catch((err) => {
      console.error(err);
    });
  }, [user]);

  return (
    <div className="mx-auto my-6 bg-trueGray-100 rounded-sm shadow-md w-full max-w-xl">
      <div className="flex">
        <div className="p-4 md:p-8 flex flex-col justify-center items-start flex-grow">
          <Link href={`/user/${follow.userId}/`} as={`/user/${follow.userId}`}>
            <div className="uppercase tracking-wide cursor-pointer text-sm text-lightBlue-500 hover:text-lightBlue-700 font-semibold">
              {follow.username}
            </div>
          </Link>

          {/* <div className="block mt-1 text-lg leading-tight font-medium text-black">
            {user.email}
          </div> */}

          <p className="mt-1 text-gray-500">{follow.bio}</p>

          <div className="tracking-wide mt-1 text-sm text-lightBlue-500 font-semibold">
            Latest Tweets by {follow.username}:
          </div>
          <div className="w-full">
            {userTweets &&
              userTweets.map((tweet) => (
                <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
              ))}
          </div>

          <Button
            color="blue"
            fluid
            onClick={() => router.push(`/user/${follow.userId}`)}
          >
            See all tweets by {follow.username}
          </Button>
        </div>
      </div>
    </div>
  );
};
