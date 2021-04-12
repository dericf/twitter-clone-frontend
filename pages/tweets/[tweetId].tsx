import { NextPage } from "next";
import { sendError } from "next/dist/next-server/server/api-utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { TweetCard } from "../../components/Tweets/TweetCard";
import { Layout } from "../../components/UI/Layout";
import { getSingleTweetById } from "../../crud/tweets";
import { useAlert } from "../../hooks/useAlert";
import { Tweet } from "../../schema/Tweet";

const TweetPage: NextPage = () => {
  const router = useRouter();
  const { sendError } = useAlert();

  const [tweet, setTweet] = useState<Tweet>(null);

  let tweetId = null;

  useEffect(() => {
    if (!router.isReady) return;
    tweetId = router.query["tweetId"];
    (async () => {
      if (tweetId) {
        const { value, error } = await getSingleTweetById(
          Number.parseInt(tweetId?.toString()),
        );
        if (error) throw new Error(error.errorMessageUI);
        setTweet(value);
      }
    })().catch((error) => {
      sendError(error);
    });
  }, [router.isReady]);
  return (
    <Layout pageTitle={`Tweet by ${tweet?.username.toUpperCase()}`}>
      <div
        className="flex self-start px-8 text-white cursor-pointer"
        onClick={() => router.back()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Go Back
      </div>
      {tweet && <TweetCard tweet={tweet} />}
    </Layout>
  );
};

export default TweetPage;
