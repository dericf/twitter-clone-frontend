import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  Ref,
  useRef,
} from "react";
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
import { PageId } from "../schema/Navigation";
import { getAllFollows } from "../crud/follows";
import { useEmitter } from "./useEmitter";
import { WSMessage } from "../schema/WebSockets";

import WSC from "../websocket/client";

// TODO: Fix the types for all setState functions
export interface StoreContextI {
  tweets: Array<Tweet>;
  setTweets: (_: Array<Tweet>) => void;
  myTweets: Array<Tweet>;
  setMyTweets: (_: Array<Tweet>) => void;
  follows: Array<Follows>;
  setFollows: (_: Array<Follows>) => void;
  followers: Array<Follower>;
  setFollowers: (_: Array<Follower>) => void;
  showSidebar: boolean;
  setShowSidebar: (_: boolean) => void;
  updateTweetContent: (body: TweetUpdateRequestBody, tweetId: number) => void;
  refreshTweets: () => void;
  activePage: string;
  setActivePage: (_: PageId) => void;
}

export const StoreContext = createContext({} as StoreContextI);

export default function StoreContextProvider({ children }) {
  //
  // Initialize Store State
  //
  const [tweets, setTweets] = useState<Array<Tweet>>([]);
  const [myTweets, setMyTweets] = useState<Array<Tweet>>([]);
  const [followers, setFollowers] = useState<Array<Follower>>([]);
  const [follows, setFollows] = useState<Array<Follows>>([]);
  const [activePage, setActivePage] = useState<PageId>("discover");
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  // Auth context
  const { user } = useAuth();

  // Toast notifications
  const { sendAlert, sendError } = useAlert();

  // Next router
  const router = useRouter();

  const { emitter } = useEmitter();

  const updateSingleTweetContent = (newContent: string, tweetId: number) => {
    // note: This isn't really the best way of handling this but perhaps
    // I'm using the wrong paradigm from the beginning... must think about this.

    // Update for the discover page
    setTweets(
      tweets.map((tweet) =>
        tweet.tweetId === tweetId ? { ...tweet, content: newContent } : tweet,
      ),
    );
    // Update for the /tweets page
    setMyTweets(
      myTweets.map((tweet) =>
        tweet.tweetId === tweetId ? { ...tweet, content: newContent } : tweet,
      ),
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
    // ! Depricated - do not use anymore
    const { value: allTweets, error } = await getAllTweets(user?.id);
    if (error) throw new Error(error.errorMessageUI);
    setTweets(allTweets);
  };

  const refreshTweetsForUser = () => {
    // ! Depricated - do not use anymore
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { value, error } = await getAllFollows(user?.id);
      if (error) return;
      setFollows(value);
    })().catch((err) => {
      console.error(err);
    });

    // Connect to websocket if not already connected
    if (!WSC.isAlreadyConnected()) {
      // console.log("Connecting to Websocket...");
      WSC.connect(user.id, emitter);
    }
  }, [user]);

  return (
    <StoreContext.Provider
      value={{
        tweets,
        setTweets,
        myTweets,
        setMyTweets,
        followers,
        setFollowers,
        follows,
        setFollows,
        showSidebar,
        setShowSidebar,
        updateTweetContent,
        refreshTweets,
        activePage,
        setActivePage,
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
