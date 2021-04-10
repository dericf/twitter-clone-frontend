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
import { getAllFollowers } from "../crud/followers";
import { Follower, FollowerResponse } from "../schema/Followers";
import { FollowerCard } from "../components/Followers/FollowerCard";
// import { UserProfileCard } from "../components/Users/UserCard";

export default function Followers() {
  const { sendAlert, sendError } = useAlert();
  const { user } = useAuth();

  const [followers, setFollowers] = useState<Array<Follower>>();

  // const [tweets, setTweets] = useState<TweetResponse>([]);
  // const { createTweet, refreshTweets, tweets } = useStore();

  useEffect(() => {
    (async () => {
      // await refreshTweets();

      const { value: allFollowers, error } = await getAllFollowers({
        userId: user?.id,
      });
      if (error) throw new Error(error);
      setFollowers(allFollowers);
    })().catch((error) => {
      sendError(error);
    });
  }, [user]);

  return (
    <Layout isProtected={true} pageTitle="People Following Me">
      {followers &&
        followers.map((follower) => (
          // <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
          <FollowerCard key={follower.userId} follower={follower} />
        ))}
      {followers?.length === 0 && (
        <div className="text-xl text-white ">No one follows you yet</div>
      )}
    </Layout>
  );
}
