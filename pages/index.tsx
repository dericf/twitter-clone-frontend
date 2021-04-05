import Head from "next/head";
import { useEffect, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { getAllTweets } from "../crud/tweets";
import { useAlert } from "../hooks/useAlert";
import { TweetResponse } from "../schema/Tweet";
import { TweetCard } from "../components/Tweets/TweetCard";
import { useStore } from "../hooks/useStore";
import { getAllFollowers } from "../crud/followers";
import { useAuth } from "../hooks/useAuth";
import { getAllFollows } from "../crud/follows";

export default function Home() {
  const { sendAlert, sendError } = useAlert();

  // const [tweets, setTweets] = useState<TweetResponse>([]);

  const { tweets, setTweets, setFollows } = useStore();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const allTweets = await getAllTweets();
      setTweets(allTweets);

      user && setFollows(await getAllFollows(user.id));
    })();
  }, []);

  return (
    <Layout pageTitle="Discover New Tweets" silentAuth>
      {tweets &&
        tweets.map((tweet) => (
          <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
        ))}
    </Layout>
  );
}
