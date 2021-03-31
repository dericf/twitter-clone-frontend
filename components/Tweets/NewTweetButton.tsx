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
import { useTweetContext } from "../../hooks/useTweetContext";

interface NewTweetPropType {
  showModal: boolean;
  setShowModal: (_: boolean) => void;
}

const NewTweetModal: FunctionComponent<NewTweetPropType> = (props) => {
  const [content, setContent] = useState("");
  const { createTweet } = useTweetContext();

  const { sendAlert, sendError } = useAlert();

  const inputRef = useRef<HTMLTextAreaElement>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await createTweet({ content });
    props.setShowModal(false);
  };

  useEffect(() => {
    if (props.showModal === true && inputRef) {
      inputRef.current?.focus();
    }
  }, [props.showModal]);

  return (
    <>
      <div className="fixed bottom-0 left-0 top-0 right-0 px-4 backdrop-blur-sm z-10">
        <div className="flex flex-col justify-center items-center fixed rounded-lg left-10 right-10 bottom-1/4 top-1/4 z-20 mx-auto  h-1/2 max-h-screen bg-white shadow-xl p-8 backdrop-filter ">
          <h4 className="text-4xl text-gray-900 mb-2">Create a New Tweet</h4>
          <form
            action="post"
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-lg"
          >
            <textarea
              ref={inputRef}
              name="content"
              className="bg-gray-300 flex-grow w-full max-lg  text-lg text-gray-900 p-4"
              id=""
              value={content}
              onChange={(e) => {
                setContent(e.currentTarget.value);
              }}
              rows={5}
            ></textarea>
            <div className="flex justify-between py-4">
              <Button color="blue" type="submit">
                Confirm
              </Button>

              <Button
                color="white"
                onClick={() => props.setShowModal(false)}
                type="submit"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

interface PropType extends JSX.IntrinsicAttributes {}

export const NewTweetButton: FunctionComponent<PropType> = (props) => {
  const router = useRouter;

  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Button color="green" onClick={() => setShowModal(true)}>
        New Tweet
      </Button>
      {showModal && (
        <NewTweetModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
};
