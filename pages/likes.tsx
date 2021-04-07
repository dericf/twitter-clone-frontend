import { useEffect, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { getLikedTweets as getLikedTweets, getAllTweets } from "../crud/tweets";
import { useAlert } from "../hooks/useAlert";
import { Tweet } from "../schema/Tweet";
import { TweetCard } from "../components/Tweets/TweetCard";
import { useAuth } from "../hooks/useAuth";
import { DEFAULT_TWEET_LIMIT } from "../constants/constants";
//
export default function Home() {
  const { sendAlert, sendError, sendInfo } = useAlert();
  const { user } = useAuth();

  const [likedTweets, setLikedTweets] = useState<Array<Tweet>>([]);
  const [loading, setLoading] = useState(false);
  const [tweetPage, setTweetPage] = useState(1); // Pagination

  useEffect(() => {
    (async () => {
      // Get all Tweets and comments that a user has liked and
      // display them ordered newest first
      try {
        const { value: allTweetLikes, error } = await getLikedTweets();

        if (error) throw new Error(error);
        setLikedTweets(allTweetLikes);
      } catch (error) {
        sendError(error);
      }
    })();
  }, [user]);

  const loadMoreTweets = async () => {
    setLoading(true);

    // Get the next page of tweets
    try {
      const { value: nextPage, error } = await getLikedTweets(
        tweetPage * DEFAULT_TWEET_LIMIT,
      );
      if (error) throw new Error(error);
      if (nextPage.length === 0) {
        // No more tweets
        sendInfo("There are no more likes to show.");
      } else {
        // Increment page # for next time
        setTweetPage(tweetPage + 1);
        // Append new tweets to the end of the list
        setLikedTweets([...likedTweets, ...nextPage]);
      }
    } catch (error) {
      sendError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout isProtected={true} pageTitle="Tweets I Like">
      {likedTweets.length === 0 ? (
        <div className="text-xl text-white ">
          You have not liked any Tweets yet
        </div>
      ) : (
        <>
          {likedTweets.map((tweet) => (
            <TweetCard key={tweet.tweetId.toString()} tweet={tweet} />
          ))}

          <div className="h-40" onClick={loadMoreTweets}>
            <Button className="mb-6" color="white" loading={loading}>
              Load More Likes
            </Button>
          </div>
        </>
      )}
    </Layout>
  );
}
