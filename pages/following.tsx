import Head from "next/head";
import { useEffect, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { getAllTweets } from "../crud/tweets";
import { useAlert } from "../hooks/useAlert";
import { Tweet, TweetResponse } from "../schema/Tweet";
import { TweetCard } from "../components/Tweets/TweetCard";
import { useAuth } from "../hooks/useAuth";
import { Protected } from "../components/Auth/Protected";
import { useStore } from "../hooks/useStore";
import { getAllFollows } from "../crud/follows";
import { UserProfileCard } from "../components/Users/UserCard";
import { FollowCard } from "../components/Follows/FollowsCard";

export default function Following() {
  const { sendAlert, sendError } = useAlert();
  const { user } = useAuth();
  const { follows, setFollows } = useStore();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { value: allFollows, error } = await getAllFollows(user.id);
      setFollows(allFollows);
    })().catch((error) => {
      sendError(error);
    });
  }, [user]);

  return (
    <Layout pageTitle="People I Follow" isProtected={true}>
      {follows &&
        follows.map((follow) => (
          <FollowCard follow={follow} key={follow.username} />
        ))}
      {follows?.length === 0 && (
        <div className="text-xl text-white ">
          You aren't following anyone yet
        </div>
      )}
    </Layout>
  );
}
