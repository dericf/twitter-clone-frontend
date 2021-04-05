import React, { useState, useContext, createContext } from "react";
import { useAlert } from "./useAlert";
import { useRouter } from "next/router";
import {
  Tweet,
  TweetCreateRequestBody,
  TweetUpdateRequestBody,
} from "../schema/Tweet";

import { createNewTweet, getAllTweets, updateTweet } from "../crud/tweets";
import { useAuth } from "./useAuth";
import { Follower } from "../schema/Followers";
import { Follows } from "../schema/Follows";

export interface StoreContextI {
  tweets: Array<Tweet>;
  setTweets: (_: Array<Tweet>) => void;
  follows: Array<Follows>;
  setFollows: (_: Array<Follows>) => void;
  followers: Array<Follower>;
  setFollowers: (_: Array<Follower>) => void;
  createTweet: (body: TweetCreateRequestBody) => void;
  updateTweetContent: (body: TweetUpdateRequestBody, tweetId: number) => void;
  updateFollowState: (newState: boolean, userId: number) => void;
  refreshTweets: () => void;
}

export const StoreContext = createContext({} as StoreContextI);

export default function StoreContextProvider({ children }) {
  const [tweets, setTweets] = useState<Array<Tweet>>([]);
  const [followers, setFollowers] = useState<Array<Follower>>([]);
  const [follows, setFollows] = useState<Array<Follows>>([]);
  const { user } = useAuth();

  // Toast notifications
  const { sendAlert, sendError } = useAlert();

  // Next router
  const router = useRouter();

  const createTweet = async (body: TweetCreateRequestBody) => {
    try {
      const resp = await createNewTweet(body);
      sendAlert("Success !");
      await refreshTweets();
    } catch (error) {
      console.log("Create Tweet Error :>> ", error);
      sendError("Error: " + error);
    }
  };

  const updateSingleTweetContent = (newContent: string, tweetId: number) => {
    setTweets(
      tweets.map((tweet) =>
        tweet.tweetId === tweetId ? { ...tweet, content: newContent } : tweet,
      ),
    );
  };

  const updateFollowState = (newState: boolean, userId: number) => {
    setFollows(
      newState === true
        ? [
            ...follows,
            {
              ...{
                userId: userId,
                bio: "",
                email: "",
                birthdate: "",
                username: "",
              },
            },
          ] // Add
        : follows.filter((f) => f.userId === userId), // Remove
    );
  };

  const updateTweetContent = async (
    body: TweetUpdateRequestBody,
    tweetId: number,
  ) => {
    try {
      const resp = await updateTweet(body, tweetId);
      sendAlert("Success! Tweet was updated.");
      updateSingleTweetContent(body.newContent, tweetId);
    } catch (error) {
      sendError(error);
    }
  };

  const refreshTweets = async () => {
    const allTweets = await getAllTweets(user?.id);
    setTweets(allTweets);
  };

  const refreshTweetsForUser = () => {
    // TODO
  };

  return (
    <StoreContext.Provider
      value={{
        tweets,
        setTweets,
        followers,
        setFollowers,
        follows,
        setFollows,
        updateTweetContent,
        updateFollowState,
        createTweet,
        refreshTweets,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  return ctx;
};