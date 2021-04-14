import Head from "next/head";
import { useEffect, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { getAllTweets } from "../crud/tweets";
import { useAlert } from "../hooks/useAlert";
import { Tweet, TweetResponse } from "../schema/Tweet";
import { TweetCard } from "../components/Tweets/TweetCard";
import { useStore } from "../hooks/useStore";
import { getAllFollowers } from "../crud/followers";
import { useAuth } from "../hooks/useAuth";
import { getAllFollows } from "../crud/follows";
import { DEFAULT_TWEET_LIMIT } from "../constants/constants";
import { GetServerSideProps, NextPage } from "next";
import { User } from "../schema/User";

interface Props {
  tweets: Array<Tweet>;
}

export default function Discover(props: Props) {
  // Custom Hooks
  const { sendAlert, sendError, sendInfo } = useAlert();
  const { user } = useAuth();
  const { tweets, setTweets, setFollows } = useStore();

  // Local state
  const [loading, setLoading] = useState(false);
  const [tweetPage, setTweetPage] = useState(1); // Pagination

  useEffect(() => {
    setTweets(props.tweets);
    (async () => {
      if (user) {
        try {
          const { value: follows, error } = await getAllFollows(user.id);

          if (error) throw new Error(error.errorMessageUI);
          setFollows(follows);
        } catch (error) {
          sendError(error);
        }
      }
    })();
  }, []);

  const loadMoreTweets = async () => {
    setLoading(true);

    // Get the next page of tweets
    const { value: nextTweets, error } = await getAllTweets(
      null,
      tweetPage * DEFAULT_TWEET_LIMIT,
    );
    console.log("Next Page of Tweets: ", nextTweets);
    if (nextTweets.length === 0) {
      // No more tweets
      sendInfo("There are no more tweets to show.");
    } else {
      // Increment page # for next time
      setTweetPage(tweetPage + 1);
      // Append new tweets to the end of the list
      setTweets([...tweets, ...nextTweets]);
    }

    setLoading(false);
  };

  return (
    <Layout pageTitle="Discover New Tweets" silentAuth>
      {tweets.length === 0 ? (
        <div className="text-xl text-white ">
          No one has tweeted yet. Be the first one!
        </div>
      ) : (
        <>
          {tweets &&
            tweets.map((tweet) => (
              <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
            ))}
          <div className="h-40" onClick={loadMoreTweets}>
            <Button className="mb-6" color="white" loading={loading}>
              Load More Tweets
            </Button>
          </div>
        </>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { value: tweets, error } = await getAllTweets();
  return {
    props: { tweets: tweets }, // will be passed to the page component as props
  };
};
