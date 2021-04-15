import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { getAllTweets } from "../crud/tweets";
import { useAlert } from "../hooks/useAlert";
import { TweetResponse } from "../schema/Tweet";
import { TweetCard } from "../components/Tweets/TweetCard";
import { useAuth } from "../hooks/useAuth";
import { Protected } from "../components/Auth/Protected";
import { useStore } from "../hooks/useStore";
import { getAllCommentsForUser } from "../crud/comments";
import { Comment } from "../schema/Comments";
import { DeleteCommentModal } from "../components/Comments/DeleteCommentModal";
import { EditCommentButton } from "../components/Comments/EditCommentModal";
import Link from "next/link";
import { CommentLikeButton } from "../components/Comments/LikeCommentButton";
import { dateFormat, timeFormat, timeFromNow } from "../utilities/dates";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";

export default function Home() {
  const { sendAlert, sendError } = useAlert();
  const { user } = useAuth();

  const [comments, setComments] = useState<Array<Comment>>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      const { value, error } = await getAllCommentsForUser(user.id);

      if (error) throw new Error(error.errorMessageUI);
      setComments(value);
    })()
      .catch((error) => {
        sendError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  return (
    <Layout pageTitle="My Comments" isProtected={true}>
      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="flex flex-col justify-stretch items-center space-y-8 w-full max-w-xl">
          {comments.map((comment) => (
            // TODO: extract into CommentCard component
            <div
              key={comment.id}
              className="flex bg-white text-blueGray-900 py-0 px-0 flex-col w-full mx-8"
            >
              <div className="flex justify-between items-center px-4 py-1">
                <div className="flex flex-col justify-start items-start flex-grow flex-shrink-0">
                  <Link
                    as={`/tweets/${comment.tweetId}`}
                    href={`/tweets/${comment.tweetId}`}
                  >
                    <span className="cursor-pointer hover:text-lightBlue-700 uppercase tracking-wide text-sm text-lightBlue-500 font-semibold">
                      Show Tweet
                    </span>
                  </Link>
                  <span className="flex items-center flex-1 mt-1 text-xs text-trueGray-600">
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
                  <div className="flex items-center flex-wrap justify-end">
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

              <p className="text-md text-blueGray-800 font-normal px-4 py-2  whitespace-pre-line">
                {comment.content}
              </p>

              <div className="bg-blueGray-400 mt-2 px-2">
                <CommentLikeButton commentId={comment.id} />
              </div>
            </div>
          ))}

          {comments?.length === 0 && (
            <div className="text-xl text-white ">
              You haven't commented yet.
            </div>
          )}
        </div>
      )}
      {/* <div key={tweet.tweetId.toString()}>{JSON.stringify(tweet, null, 4)}</div> */}
    </Layout>
  );
}
