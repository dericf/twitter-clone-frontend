import Head from "next/head";
import { useEffect, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { getAllTweets } from "../crud/tweets";
import { useAlert } from "../hooks/useAlert";
import { TweetResponse } from "../schema/Tweet";
import {TweetCard} from "../components/Tweets/TweetCard"

export default function Home() {
  const { sendAlert, sendError } = useAlert();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tweets, setTweets] = useState<TweetResponse>([]);

  useEffect(() => {
    (async () => {
      const allTweets = await getAllTweets();
      setTweets(allTweets);
    })();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col w-full h-full items-center justify-items-center">
        <h3 className="mx-auto text-3xl text-white py-2">Discover New Tweets</h3>
        {tweets &&
          tweets.map((tweet) => <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />)}
          {/* <div key={tweet.tweetId.toString()}>{JSON.stringify(tweet, null, 4)}</div> */}
      </div>
    </Layout>
  );
}
