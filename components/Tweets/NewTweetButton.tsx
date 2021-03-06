import React, {
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
import { MAX_TWEET_LENGTH } from "../../constants/constants";
import { createNewTweet } from "../../crud/tweets";
import { ModalPortalWrapper } from "../UI/Modals/ModalPortalWrapper";
import { ModalBackdrop } from "../UI/Modals/ModalBackdrop";

interface NewTweetPropType {
  showModal: boolean;
  setShowModal: (_: boolean) => void;
}

const NewTweetModal: FunctionComponent<NewTweetPropType> = (props) => {
  const [content, setContent] = useState("");
  const {
    tweets,
    myTweets,
    setTweets,
    setMyTweets,
    updateTweetContent,
  } = useStore();
  const router = useRouter();
  const { sendAlert, sendError } = useAlert();

  const inputRef = useRef<HTMLTextAreaElement>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const { value, error } = await createNewTweet({ content });
      if (error) throw new Error(error.errorMessageUI);
      // Update for the discover page

      setTweets([{ ...value }, ...tweets]);
      setMyTweets([{ ...value }, ...myTweets]);
      props.setShowModal(false);
    } catch (error) {
      sendError(error);
    }
  };

  const closeOnEscape = (e) => {
    if (e.key === "Escape") {
      props.setShowModal(false);
    }
  };

  useEffect(() => {
    // Listen for escape keypress
    if (document) document?.addEventListener("keydown", closeOnEscape, false);

    // Auto-focus on textarea when component loads
    if (props.showModal === true && inputRef) {
      inputRef.current?.focus();
    }

    return () => {
      if (document)
        document?.removeEventListener("keydown", closeOnEscape, false);
    };
  }, [props.showModal]);

  return (
    <ModalPortalWrapper>
      <ModalBackdrop closeModal={() => props.setShowModal(false)}>
        <div
          className="flex flex-col justify-center items-center
            mx-auto p-8 
            fixed 
            left-0 md:left-1/4 
            right-0 md:right-1/4
            top-1/4 
            max-h-screen 
            shadow-xl 
            backdrop-filter
            bg-white"
          onClick={(e) => {
            // do not close modal if anything inside modal content is clicked
            e.stopPropagation();
          }}
        >
          <h4 className="text-4xl text-gray-900 mb-2">Create a New Tweet</h4>
          <form
            action="post"
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-lg"
          >
            <textarea
              ref={inputRef}
              name="content"
              autoFocus={true}
              className="bg-blueGray-600 tracking-wider flex-grow w-full max-lg  text-lg text-white p-4 focus:ring-0 focus:border-white"
              id=""
              value={content}
              onChange={(e) => {
                e.currentTarget.value.length > MAX_TWEET_LENGTH
                  ? sendError(
                      `Tweet cannot exceed ${MAX_TWEET_LENGTH} in length.`,
                    )
                  : setContent(e.currentTarget.value);
              }}
              rows={5}
            ></textarea>
            <div className="flex justify-between mt-8 -mx-8 -mb-8">
              <Button
                className="flex-grow rounded-none border-none"
                color="white"
                onClick={() => props.setShowModal(false)}
                type="submit"
                addMargins={false}
              >
                Cancel
              </Button>

              <Button
                color="blue"
                type="submit"
                className="flex-grow rounded-none"
                disabled={
                  content.length === 0 || content.length > MAX_TWEET_LENGTH
                }
                addMargins={false}
              >
                Confirm
              </Button>
            </div>
          </form>
        </div>
      </ModalBackdrop>
    </ModalPortalWrapper>
  );
};

interface PropType extends JSX.IntrinsicAttributes {}

export const NewTweetButton: FunctionComponent<PropType> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Button
        color="white"
        onClick={() => setShowModal(true)}
        className="flex items-center justify-between hover:animate-pulse"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Tweet
      </Button>
      {showModal && (
        <NewTweetModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
};
