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

      // Optimistically update the comment in the UI (At the beginning of the list)
      setComments([{ ...value }, ...comments]);

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
    <div className="flex justify-center w-full mx-0 place-self-center">
      <div className="flex flex-col w-full  text-white bg-blueGray-300 py-3 px-6 justify-center items-center">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex bg-white text-blueGray-900 py-2 px-3 flex-col w-full mx-8 h-24 mb-4"
          >
            <div className="uppercase tracking-wide text-sm text-lightBlue-500 font-semibold flex justify-between items-center">
              <Link
                as={`/user/${comment.userId}`}
                href={`/users/${comment.userId}`}
              >
                <span className="cursor-pointer hover:text-lightBlue-700">
                  {comment.username}{" "}
                  {comment.userId == user?.id && <>{"(me)"}</>}
                </span>
              </Link>
            </div>

            <p className="text-md text-blueGray-800 font-normal">
              {comment.content}
            </p>
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
            className="px-4 py-2 bg-blueGray-600 text-white focus:ring-0 focus:border-blueGray-600"
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
            color="green"
            className=" flex items-center justify-center flex-grow -mx-0"
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
