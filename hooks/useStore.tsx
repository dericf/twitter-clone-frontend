import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  Ref,
  useRef,
  Dispatch,
  SetStateAction,
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
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
  myTweets: Array<Tweet>;
  setMyTweets: Dispatch<SetStateAction<Tweet[]>>;
  follows: Array<Follows>;
  setFollows: Dispatch<SetStateAction<Follows[]>>;
  followers: Array<Follower>;
  setFollowers: Dispatch<SetStateAction<Follower[]>>;
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  updateTweetContent: (body: TweetUpdateRequestBody, tweetId: number) => void;
  activePage: string;
  setActivePage: Dispatch<SetStateAction<PageId>>;
}

export const StoreContext = createContext({} as StoreContextI);

export default function StoreContextProvider({ children }) {
  //
  // Initialize Store State
  //
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [myTweets, setMyTweets] = useState<Tweet[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [follows, setFollows] = useState<Follows[]>([]);
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
    setTweets((prev) =>
      prev.map((tweet) =>
        tweet.tweetId === tweetId ? { ...tweet, content: newContent } : tweet,
      ),
    );
    // Update for the /tweets page
    setMyTweets((prev) =>
      prev.map((tweet) =>
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
