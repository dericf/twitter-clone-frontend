import React, { useState, useContext, createContext } from "react";
import { useAlert } from "./useAlert";
import { useRouter } from "next/router";
import { Tweet, TweetCreateRequestBody } from "../schema/Tweet";

import { createNewTweet, getAllTweets } from "../crud/tweets";
import { useAuth } from "./useAuth";


export interface TweetContextI {
  tweets: Array<Tweet>,
	createTweet: (body: TweetCreateRequestBody) => void,
	refreshTweets: () => void,
}

export const TweetContext = createContext({} as TweetContextI);

export default function TweetContextProvider({ children }) {
  const [tweets, setTweets] = useState<Array<Tweet>>([]);
	const {user} = useAuth()
  // Toast notifications
  const { sendAlert, sendError } = useAlert();

  // Next router
  const router = useRouter();

  const createTweet = async (body: TweetCreateRequestBody) => {
    try {
      const resp = await createNewTweet(body);
      sendAlert("Success !");
			await refreshTweets()
    } catch (error) {
      console.log("Create Tweet Error :>> ", error);
      sendError("Error: " + error);
    }
  };

  const refreshTweets = async () => {
    const allTweets = await getAllTweets(user?.id);
    setTweets(allTweets);
  };

  return (
    <TweetContext.Provider
      value={{
        tweets,
        createTweet,
        refreshTweets,
      }}
    >
      {children}
    </TweetContext.Provider>
  );
}

export const useTweetContext = () => {
  const ctx = useContext(TweetContext);
  return ctx;
};
