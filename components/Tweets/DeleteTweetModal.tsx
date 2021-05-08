import {
  FormEventHandler,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Button } from "../UI/Button";

import { useAlert } from "../../hooks/useAlert";

import { useAuth } from "../../hooks/useAuth";

import { ConfirmModal } from "../UI/Modals/ConfirmModal";
import { deleteTweet } from "../../crud/tweets";
import { useStore } from "../../hooks/useStore";

interface PropType extends JSX.IntrinsicAttributes {
  tweetId: number;
}

export const DeleteTweetModal: FunctionComponent<PropType> = (props) => {
  const router = useRouter;
  const { sendAlert, sendError } = useAlert();
  const { tweets, setTweets, myTweets, setMyTweets } = useStore();
  const { tweetId } = props;

  const [showModal, setShowModal] = useState<boolean>(false);

  const tryDeleteTweet = async () => {
    try {
      const response = await deleteTweet(tweetId);
      // Optimistically update UI to remove the tweet
      setTweets(tweets.filter((tweet) => tweet.tweetId !== tweetId));
      setMyTweets(myTweets.filter((tweet) => tweet.tweetId !== tweetId));
      sendAlert("Success. Your tweet has been deleted.");
    } catch (error) {
      console.log("error deleting tweet :>> ", error);
      sendError(`${error}`);
    }
  };

  return (
    <>
      <Button
        color="white"
        onClick={() => setShowModal(true)}
        title="Delete Your Tweet"
        className="flex items-center"
        animated
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span className="hidden sm:inline">Delete</span>
      </Button>
      {showModal && (
        <ConfirmModal
          title="Delete Your Tweet"
          showModal={showModal}
          setShowModal={setShowModal}
          onConfirm={tryDeleteTweet}
        ></ConfirmModal>
      )}
    </>
  );
};
