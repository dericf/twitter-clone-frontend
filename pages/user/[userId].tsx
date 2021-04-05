import Head from "next/head";
import { useEffect, useState } from "react";
import { Button } from "../../components/UI/Button";
import { Layout } from "../../components/UI/Layout";
import { getAllTweets } from "../../crud/tweets";
import { useAlert } from "../../hooks/useAlert";
import { TweetResponse } from "../../schema/Tweet";
import { TweetCard } from "../../components/Tweets/TweetCard";
import { Protected } from "../../components/Auth/Protected";
import { useRouter } from "next/router";
import { getUserById } from "../../crud/users";
import { User } from "../../schema/User";
import { LoadingSpinner } from "../../components/UI/LoadingSpinner";

export default function Home() {
  const { sendAlert, sendError } = useAlert();
  const router = useRouter();

  const [user, setUser] = useState<User>(null);
  const [tweets, setTweets] = useState<TweetResponse>([]);

  let userId = null;

  // const { userId } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    userId = router.query["userId"];
    (async () => {
      // const allTweets = await getAllTweets();
      // setTweets(allTweets);
      console.log("userId :>> ", userId);
      if (userId) {
        const user: User = await getUserById(
          Number.parseInt(userId?.toString()),
        );
        setUser(user);
        const userTweets = await getAllTweets(userId);
        setTweets(userTweets);
      }
    })();
  }, [router.isReady]);

  return (
    <Layout isProtected={true}>
      <div className="flex flex-col w-full h-full items-center justify-items-center">
        <h3 className="mx-auto text-3xl text-white py-2">
          {user && user.username}
        </h3>
        {tweets &&
          tweets.map((tweet) => (
            <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
          ))}
      </div>
    </Layout>
  );
}
