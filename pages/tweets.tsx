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
import { useTweetContext } from "../hooks/useTweetContext";

export default function Home() {
  const { sendAlert, sendError } = useAlert();
  const { user } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [tweets, setTweets] = useState<TweetResponse>([]);
  const {createTweet, refreshTweets, tweets} = useTweetContext()

  useEffect(() => {
    (async () => {
      await refreshTweets();
    })();
  }, [user]);

  return (
    <Protected>
      <Layout>
        {/* TODO: Need 3 columns here | leftsidebar - content - rightsidebar |*/}
        <div className="flex flex-col w-full h-full items-center justify-items-center">
          <h3 className="mx-auto text-3xl text-white py-2">My Tweets</h3>
          {tweets &&
            tweets.map((tweet) => (
              <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
            ))}
          {/* <div key={tweet.tweetId.toString()}>{JSON.stringify(tweet, null, 4)}</div> */}
        </div>
      </Layout>
    </Protected>
  );
}
