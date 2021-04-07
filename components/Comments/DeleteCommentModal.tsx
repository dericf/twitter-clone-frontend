import {
  FormEventHandler,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Button } from "../UI/Button";

import { useAlert } from "../../hooks/useAlert";

import { ConfirmModal } from "../Modals/ConfirmModal";
import { deleteComment } from "../../crud/comments";
import { Comment } from "../../schema/Comments";

interface PropType extends JSX.IntrinsicAttributes {
  commentId: number;
  comments: Array<Comment>;
  setComments: (_: Array<Comment>) => void;
}

export const DeleteCommentModal: FunctionComponent<PropType> = (props) => {
  const router = useRouter;
  const { sendAlert, sendError } = useAlert();

  const { commentId, comments, setComments } = props;

  const [showModal, setShowModal] = useState<boolean>(false);

  const tryDeleteComment = async () => {
    try {
      const { value, error } = await deleteComment(commentId);
      if (error) {
        // Optimistically update UI to remove the tweet
        throw new Error(error);
      }
      // No error
      setComments(comments.filter((comment) => comment.id !== commentId));
      sendAlert("Your comment has been deleted.");
    } catch (error) {
      // console.log("error deleting comment :>> ", error);
      sendError(`${error}`);
    }
  };

  return (
    <>
      <Button
        color="white"
        onClick={() => setShowModal(true)}
        title="Delete Your Comment"
        className="flex items-center"
        animated
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
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
        Delete
      </Button>
      {showModal && (
        <ConfirmModal
          title="Delete Your Comment"
          showModal={showModal}
          setShowModal={setShowModal}
          onConfirm={tryDeleteComment}
        ></ConfirmModal>
      )}
    </>
  );
};
