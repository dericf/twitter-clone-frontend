import React, { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useStore } from "../../hooks/useStore";
import { Comment } from "../../schema/Comments";
import { createNewComment, getAllCommentsForTweet } from "../../crud/comments";
import { Button } from "../UI/Button";
import { MAX_COMMENT_LENGTH } from "../../constants/constants";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import { DeleteCommentModal } from "./DeleteCommentModal";
import { EditCommentButton } from "./EditCommentModal";

interface PropType extends JSX.IntrinsicAttributes {
  tweetId: number;
}

export const CommentList: FunctionComponent<PropType> = (props) => {
  const router = useRouter;

  const { user } = useAuth();
  const { sendError, sendAlert } = useAlert();
  const { tweetId } = props;

  const [comments, setComments] = useState<Array<Comment>>([]);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Try posting the comment
    try {
      const { value, error } = await createNewComment(tweetId, newComment);
      if (error) throw new Error(error);

      // Toast Notification
      sendAlert("Success. Your comment has been added");

      // Optimistically update the comment in the UI (At the end of the list)
      setComments([...comments, { ...value }]);

      // Reset the textarea
      setNewComment("");
    } catch (error) {
      sendError("Could not create your comment. " + error);
    }
  };

  useEffect(() => {
    (async () => {
      const { value, error } = await getAllCommentsForTweet(tweetId);
      if (error) throw new Error(error);
      setComments(value);
    })().catch((err) => {
      console.error(err);
      setComments([]);
    });
  }, []);

  return (
    <div className="flex justify-center w-full mx-0 mt-4 place-self-center">
      <div className="flex flex-col w-full text-white bg-blueGray-300 py-0 px-0 justify-center items-center">
        <h3 className="text-2xl mb-2 tracking-wide text-trueGray-800">
          Comments
        </h3>

        {comments.map((comment) => (
          // TODO: extract into CommentCard component
          <div
            key={comment.id}
            className="flex bg-white text-blueGray-900 py-0 px-0 flex-col w-full mx-8 mb-4"
          >
            <div className="flex justify-between items-center px-4 py-1">
              <Link
                as={`/user/${comment.userId}`}
                href={`/users/${comment.userId}`}
              >
                <span className="cursor-pointer hover:text-lightBlue-700 uppercase tracking-wide text-sm text-lightBlue-500 font-semibold">
                  {comment.username}{" "}
                  {comment.userId == user?.id && <>{"(me)"}</>}
                </span>
              </Link>
              {comment.userId == user?.id && (
                <div className="flex items-center">
                  <EditCommentButton
                    comment={comment}
                    comments={comments}
                    setComments={setComments}
                  />
                  <DeleteCommentModal
                    commentId={comment.id}
                    comments={comments}
                    setComments={setComments}
                  />
                </div>
              )}
            </div>

            <p className="text-md text-blueGray-800 font-normal px-4 py-2">
              {comment.content}
            </p>

            <div className="bg-blueGray-400 mt-2 px-2">
              <Button color="white" className="w-max">
                <svg
                  className="w-4 h-4 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </Button>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <h2 className="text-lg text-blueGray-800 mb-2">No Comments Yet</h2>
        )}

        <form
          method="POST"
          action="#"
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-stretch w-full pt-3"
        >
          <textarea
            name="newComment"
            id="newComment"
            rows={5}
            placeholder="Add your thoughts here"
            value={newComment}
            className="px-4 py-4 bg-blueGray-600 text-white placeholder-trueGray-400 focus:ring-0 border-none focus:border-none"
            onChange={(e) => {
              if (e.currentTarget.value.length <= MAX_COMMENT_LENGTH) {
                setNewComment(e.currentTarget.value);
              } else {
                sendError(
                  `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`,
                );
                return false;
              }
            }}
          ></textarea>
          <Button
            type="submit"
            color="white"
            className="mx-0"
            disabled={newComment.length === 0}
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
            </svg>{" "}
            Comment
          </Button>
        </form>
      </div>
    </div>
  );
};
