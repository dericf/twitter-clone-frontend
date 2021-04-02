import Head from "next/head";
import { useEffect, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { getAllLikedTweets, getAllTweets } from "../crud/tweets";
import { useAlert } from "../hooks/useAlert";
import { TweetResponse } from "../schema/Tweet";
import { TweetCard } from "../components/Tweets/TweetCard";
import { useAuth } from "../hooks/useAuth";
import { Protected } from "../components/Auth/Protected";
import { useTweetContext } from "../hooks/useTweetContext";
import { getAllTweetLikes } from "../crud/likes";

export default function Home() {
  const { sendAlert, sendError } = useAlert();
  const { user } = useAuth();

  const [likedTweets, setLikedTweets] = useState<TweetResponse>();
  // const [tweets, setTweets] = useState<TweetResponse>([]);
  // const { createTweet, refreshTweets, tweets } = useTweetContext();
  
  useEffect(() => {
    (async () => {
      // Get all Tweets and comments that a user has liked and
      // display them ordered newest first
      const allTweetLikes = await getAllLikedTweets();
      setLikedTweets(allTweetLikes)
      
    })();
  }, [user]);

  return (
    <Layout isProtected={true} pageTitle="Tweets I Like">
      {/* TODO: Need 3 columns here | leftsidebar - content - rightsidebar |*/}
      <div className="flex flex-col w-full h-full items-center justify-items-center">
        
        {likedTweets &&
          likedTweets.map((tweet) => (
            <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
          ))}
        {/* <div key={tweet.tweetId.toString()}>{JSON.stringify(tweet, null, 4)}</div> */}
      </div>
    </Layout>
  );
}
