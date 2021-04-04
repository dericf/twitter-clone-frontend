import {
  Dispatch,
  FormEventHandler,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "../UI/Button";

// import { createNewTweet } from "../../crud/tweets";
import { useAlert } from "../../hooks/useAlert";
import { useStore } from "../../hooks/useStore";
import { Tweet } from "../../schema/Tweet";

interface NewTweetPropType {
  tweet: Tweet;
  showModal: boolean;
  setShowModal: (_: boolean) => void;
}

const MAX_TWEET_LENGTH = 40;

const EditTweetModal: FunctionComponent<NewTweetPropType> = (props) => {
  // Destructure Props
  const { tweet, showModal, setShowModal } = props;

  // Local State
  const [newContent, setNewContent] = useState(tweet.content);

  // Use Store/Context
  const { createTweet, updateTweetContent } = useStore();

  // Toast Notif.
  const { sendAlert, sendError } = useAlert();

  // Ref
  const inputRef = useRef<HTMLTextAreaElement>();

  // On Submit
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await updateTweetContent({ newContent }, tweet.tweetId);
    setShowModal(false);
  };

  const closeOnEscape = (e) => {
    if (e.key === "Escape") {
      props.setShowModal(false);
    }
  };
  // On modal shown
  useEffect(() => {
    if (document) document?.addEventListener("keydown", closeOnEscape, false);

    if (props.showModal === true && inputRef) {
      inputRef.current?.focus();
    }
    return () => {
      if (document)
        document?.removeEventListener("keydown", closeOnEscape, false);
    };
  }, [props.showModal]);

  return (
    <>
      <div className="fixed bottom-0 left-0 top-0 right-0 px-4 backdrop-blur-md z-10">
        <div
          className="flex flex-col justify-center items-center
            mx-auto p-8 rounded-lg 
            fixed 
            left-0 md:left-1/4 
            right-0 md:right-1/4
            bottom-1/4 
            top-1/4 
            h-1/2 max-h-screen 
            z-20 shadow-xl 
            backdrop-filter
            bg-white"
        >
          <h4 className="text-4xl text-gray-900 mb-2">Edit Tweet Content</h4>
          <form
            action="post"
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-lg"
          >
            <textarea
              ref={inputRef}
              name="newContent"
              className="bg-blueGray-600 tracking-wider flex-grow w-full max-lg  text-lg text-white p-4"
              id=""
              value={newContent}
              onChange={(e) => {
                e.currentTarget.value.length > MAX_TWEET_LENGTH
                  ? sendError(
                      `Tweet cannot exceed ${MAX_TWEET_LENGTH} in length.`,
                    )
                  : setNewContent(e.currentTarget.value);
              }}
              rows={5}
            ></textarea>
            <div className="flex justify-between py-4">
              <Button
                className="flex-grow"
                color="white"
                onClick={() => props.setShowModal(false)}
                type="submit"
              >
                Cancel
              </Button>

              <Button
                color="blue"
                type="submit"
                className="flex-grow"
                disabled={
                  newContent.length === 0 ||
                  newContent.length > MAX_TWEET_LENGTH
                }
              >
                Confirm
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

interface PropType extends JSX.IntrinsicAttributes {
  tweet: Tweet;
}

export const EditTweetButton: FunctionComponent<PropType> = (props) => {
  const router = useRouter;

  const { tweet } = props;

  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Button color="green" onClick={() => setShowModal(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Edit
      </Button>
      {showModal && (
        <EditTweetModal
          tweet={tweet}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};
