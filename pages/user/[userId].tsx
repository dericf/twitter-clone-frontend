import { useEffect, useState } from "react";
import { Layout } from "../../components/UI/Layout";
import { getAllTweets } from "../../crud/tweets";
import { useAlert } from "../../hooks/useAlert";
import { TweetCard } from "../../components/Tweets/TweetCard";
import { useRouter } from "next/router";
import { getUserById } from "../../crud/users";
import { User } from "../../schema/User";
import { useStore } from "../../hooks/useStore";

export default function Home() {
  const { sendAlert, sendError } = useAlert();
  const router = useRouter();

  const [user, setUser] = useState<User>(null);
  const { tweets, setTweets } = useStore();

  let userId = null;

  // const { userId } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    userId = router.query["userId"];
    (async () => {
      if (userId) {
        const { value: user, error } = await getUserById(
          Number.parseInt(userId?.toString()),
        );
        setUser(user);
        try {
          const { value: userTweets, error } = await getAllTweets(userId);
          if (error) throw new Error(error);
          setTweets(userTweets);
        } catch (error) {
          sendError(error);
        }
      }
    })();
  }, [router.isReady]);

  return (
    <Layout isProtected={true}>
      <div className="flex flex-col w-full h-full items-center justify-items-center">
        <h3 className="mx-auto text-3xl text-white py-2">
          {user && user.username}
        </h3>
        {tweets &&
          tweets.map((tweet) => (
            <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
          ))}
      </div>
    </Layout>
  );
}
