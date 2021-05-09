import React, { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useStore } from "../../hooks/useStore";
import {
  Comment,
  WSCommentCreatedBody,
  WSCommentDeletedBody,
  WSCommentUpdatedBody,
} from "../../schema/Comments";
import { createNewComment, getAllCommentsForTweet } from "../../crud/comments";
import { Button } from "../UI/Button";
import { MAX_COMMENT_LENGTH } from "../../constants/constants";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import { DeleteCommentModal } from "./DeleteCommentModal";
import { EditCommentButton } from "./EditCommentModal";
import { CommentLikeButton } from "./LikeCommentButton";
import { dateFormat, timeFormat, timeFromNow } from "../../utilities/dates";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { useEmitter } from "../../hooks/useEmitter";
import { WSMessage, WSSubscription } from "../../schema/WebSockets";

interface PropType extends JSX.IntrinsicAttributes {
  tweetId: number;
}

export const CommentList: FunctionComponent<PropType> = (props) => {
  // props destructure
  const { tweetId } = props;
  // hooks
  const router = useRouter();
  const { user } = useAuth();
  const { sendError, sendAlert } = useAlert();
  const { emitter } = useEmitter();

  // Local State
  const [comments, setComments] = useState<Array<Comment>>(null);
  const [newCommentText, setNewCommentText] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Try posting the comment
    try {
      const { value, error } = await createNewComment(tweetId, newCommentText);
      if (error) throw new Error(error.errorMessageUI);

      // Toast Notification
      sendAlert("Success. Your comment has been added");

      // Optimistically update the comment in the UI (At the end of the list)
      setComments([...comments, { ...value }]);

      // Reset the textarea
      setNewCommentText("");
      //
      // emit a message so comment count can update
      //
      emitter.emit("comments.count.new", { body: { tweetId } });
    } catch (error) {
      sendError("Could not create your comment. " + error);
    }
  };

  const handleCommentTyping = (e) => {
    if (e.currentTarget.value.length <= MAX_COMMENT_LENGTH) {
      setNewCommentText(e.currentTarget.value);
    } else {
      sendError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`);
      return false;
    }
  };

  const newComment = ({ body }: WSMessage<WSCommentCreatedBody>) => {
    if (body.comment.tweetId === tweetId) {
      // console.log("A comment was added", body);
      setComments((prev) => [...prev, body.comment]);
      emitter.emit("comments.count.new", { body: { tweetId } });
    }
  };

  const updatedComment = ({ body }: WSMessage<WSCommentUpdatedBody>) => {
    if (body.comment.tweetId === tweetId) {
      // console.log("A comment was updated", body);
      setComments((prev) =>
        prev.map((com) => (com.id === body.comment.id ? body.comment : com)),
      );
    }
  };

  const deletedComment = ({ body }: WSMessage<WSCommentDeletedBody>) => {
    if (body.tweetId === tweetId) {
      // console.log("A comment was deleted", body);
      setComments((prev) => prev.filter((com) => com.id !== body.commentId));
      emitter.emit("comments.count.deleted", { body: { tweetId } });
    }
  };

  useEffect(() => {
    (async () => {
      const { value, error } = await getAllCommentsForTweet(tweetId);
      if (error) throw new Error(error.errorMessageUI);
      setComments(value);
    })().catch((err) => {
      console.error(err);
      setComments([]);
    });
  }, []);

  useEffect(() => {
    const wsSubscriptions: WSSubscription = new Map();
    wsSubscriptions.set("comments.new", newComment);
    wsSubscriptions.set("comments.updated", updatedComment);
    wsSubscriptions.set("comments.deleted", deletedComment);
    //
    // subscribe
    //
    wsSubscriptions.forEach((callback, code) => {
      emitter.off(code, callback);
      emitter.on(code, callback);
    });
    //
    // Cleanup
    //
    return () => {
      // remove the listeners.
      wsSubscriptions.forEach((callback, code) => {
        emitter.off(code, callback);
      });
    };
  }, [user]);

  return (
    <div className="flex justify-center w-full mx-0 mt-4 place-self-center">
      <div className="flex flex-col w-full text-white bg-blueGray-300 py-0 px-0 justify-center items-center">
        <h3 className="text-2xl mb-2 tracking-wide text-trueGray-800">
          Comments
        </h3>

        {comments === null && <LoadingSpinner />}

        {comments &&
          comments.map((comment) => (
            // TODO: extract into CommentCard component
            <div
              key={comment.id}
              className="flex bg-white text-blueGray-900 py-0 px-0 flex-col w-full mx-8 mb-4"
            >
              <div className="flex justify-between items-center px-4 py-1">
                <div className="flex flex-col">
                  <Link
                    as={`/user/${comment.userId}`}
                    href={`/users/${comment.userId}`}
                  >
                    <span className="cursor-pointer hover:text-lightBlue-700 uppercase tracking-wide text-sm text-lightBlue-500 font-semibold">
                      @{comment.username}{" "}
                      {comment.userId == user?.id && <>{"(me)"}</>}
                    </span>
                  </Link>
                  <span className="flex items-center flex-1 text-xs text-trueGray-600">
                    {timeFromNow(comment.createdAt)}{" "}
                    <span
                      className="cursor-default text-trueGray-500 hover:text-trueGray-700 ml-1"
                      title={`${timeFormat(comment.createdAt)} on ${dateFormat(
                        comment.createdAt,
                      )}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                </div>
                {comment.userId == user?.id && (
                  <div className="flex items-center">
                    <EditCommentButton
                      comment={comment}
                      comments={comments}
                      setComments={setComments}
                    />
                    <DeleteCommentModal
                      tweetId={tweetId}
                      commentId={comment.id}
                      comments={comments}
                      setComments={setComments}
                    />
                  </div>
                )}
              </div>

              <p className="text-xl text-blueGray-800 font-normal px-4 py-2 whitespace-pre-line">
                {comment.content}
              </p>

              <div className="bg-blueGray-400 mt-2 px-2">
                <CommentLikeButton commentId={comment.id} />
              </div>
            </div>
          ))}

        {comments && comments.length === 0 && (
          <h2 className="text-lg text-blueGray-800 mb-2">No Comments Yet</h2>
        )}

        <form
          method="POST"
          action="#"
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-stretch w-full pt-3"
        >
          <textarea
            name="newCommentText"
            id="newCommentText"
            rows={5}
            placeholder="Add your thoughts here"
            value={newCommentText}
            className="px-4 py-4 bg-blueGray-600 text-white placeholder-trueGray-400 focus:ring-0 border-none focus:border-none"
            onChange={handleCommentTyping}
          ></textarea>
          <Button
            type="submit"
            color="white"
            className="my-2"
            disabled={newCommentText.length === 0}
            addMargins={false}
          >
            {/* <svg
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
            </svg>{" "} */}
            Comment
          </Button>
        </form>
      </div>
    </div>
  );
};
