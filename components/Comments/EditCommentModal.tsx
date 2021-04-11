import {
  FormEventHandler,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";

import { Button } from "../UI/Button";

import { useAlert } from "../../hooks/useAlert";
import { useStore } from "../../hooks/useStore";
import { MAX_COMMENT_LENGTH } from "../../constants/constants";
import { Comment } from "../../schema/Comments";
import { updateComment } from "../../crud/comments";

interface EditCommentModalPropType {
  comment: Comment;
  showModal: boolean;
  setShowModal: (_: boolean) => void;
  comments: Array<Comment>;
  setComments: (_: Array<Comment>) => void;
}

const EditCommentModal: FunctionComponent<EditCommentModalPropType> = (
  props,
) => {
  // Destructure Props
  const { comment, showModal, setShowModal, comments, setComments } = props;

  // Local State
  const [newContent, setNewContent] = useState(comment.content);

  // Toast Notif.
  const { sendAlert, sendError } = useAlert();

  // Ref
  const inputRef = useRef<HTMLTextAreaElement>();

  // On Submit
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const { value, error } = await updateComment(newContent, comment.id);
      if (error) {
        throw new Error(error.errorMessageUI);
      }

      // No error - Update UI
      setComments(
        comments.map((c) => {
          if (comment.id === c.id) {
            return { ...c, content: newContent };
          } else {
            return c;
          }
        }),
      );
      sendAlert("Your comment has been updated.");
      setShowModal(false);
    } catch (error) {
      sendError(`${error}`);
    }
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
  }, [showModal]);

  return (
    <>
      <div className="fixed bottom-0 left-0 top-0 right-0 px-4 backdrop-blur-md z-10">
        <div
          className="flex flex-col justify-center items-center
            mx-auto p-8
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
          <h4 className="text-4xl text-gray-900 mb-2">Edit Comment Content</h4>
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
                e.currentTarget.value.length > MAX_COMMENT_LENGTH
                  ? sendError(
                      `Comment cannot exceed ${MAX_COMMENT_LENGTH} in length.`,
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
                  newContent.length > MAX_COMMENT_LENGTH
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
  comment: Comment;
  comments: Array<Comment>;
  setComments: (_: Array<Comment>) => void;
}

export const EditCommentButton: FunctionComponent<PropType> = (props) => {
  const router = useRouter;

  const { comment, comments, setComments } = props;

  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Button
        animated
        color="green"
        onClick={() => setShowModal(true)}
        className="flex justify-between items-center"
      >
        <svg
          className="h-4 w-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Edit
      </Button>
      {showModal && (
        <EditCommentModal
          comment={comment}
          showModal={showModal}
          setShowModal={setShowModal}
          comments={comments}
          setComments={setComments}
        />
      )}
    </>
  );
};
