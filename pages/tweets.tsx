import Head from "next/head";
import { useEffect, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { getAllTweets } from "../crud/tweets";
import { useAlert } from "../hooks/useAlert";
import { TweetResponse } from "../schema/Tweet";
import { TweetCard } from "../components/Tweets/TweetCard";
import { useAuth } from "../hooks/useAuth";
import { Protected } from "../components/Auth/Protected";
import { useStore } from "../hooks/useStore";

export default function Home() {
  const { sendAlert, sendError } = useAlert();
  const { user } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [tweets, setTweets] = useState<TweetResponse>([]);
  const { createTweet, refreshTweets, tweets } = useStore();

  useEffect(() => {
    (async () => {
      await refreshTweets();
    })();
  }, [user]);

  return (
    <Layout pageTitle="My Tweets" isProtected={true}>
      {tweets &&
        tweets.map((tweet) => (
          <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
        ))}

      {tweets?.length === 0 && (
        <div className="text-xl text-white ">You have no Tweets yet</div>
      )}
      {/* <div key={tweet.tweetId.toString()}>{JSON.stringify(tweet, null, 4)}</div> */}
    </Layout>
  );
}
