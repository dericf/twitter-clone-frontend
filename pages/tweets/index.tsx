import Head from "next/head";
import { useEffect, useState } from "react";
import { Button } from "../../components/UI/Button";
import { Layout } from "../../components/UI/Layout";
import { getAllTweets } from "../../crud/tweets";
import { useAlert } from "../../hooks/useAlert";
import { TweetResponse } from "../../schema/Tweet";
import { TweetCard } from "../../components/Tweets/TweetCard";
import { useAuth } from "../../hooks/useAuth";
import { Protected } from "../../components/Auth/Protected";
import { useStore } from "../../hooks/useStore";

export default function Tweets() {
  const { sendAlert, sendError } = useAlert();
  const { user } = useAuth();

  const { myTweets, setMyTweets } = useStore();

  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      try {
        const { value, error } = await getAllTweets(user.id);

        if (error) throw new Error(error.errorMessageUI);
        setMyTweets(value);
      } catch (error) {
        sendError(error);
      }
    })();
  }, [user]);

  return (
    <Layout pageTitle="My Tweets" isProtected={true}>
      {myTweets &&
        myTweets.map((tweet) => (
          <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
        ))}

      {myTweets?.length === 0 && (
        <div className="text-xl text-white ">You have no Tweets yet</div>
      )}
    </Layout>
  );
}
