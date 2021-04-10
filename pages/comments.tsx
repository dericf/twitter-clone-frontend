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

export default function Home() {
  const { sendAlert, sendError } = useAlert();
  const { user } = useAuth();

  const [comments, setComments] = useState<Array<Comment>>([]);

  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      const { value, error } = await getAllCommentsForUser(user.id);

      if (error) throw new Error(error);
      setComments(value);
    })().catch((error) => {
      sendError(error);
    });
  }, [user]);

  return (
    <Layout pageTitle="My Comments" isProtected={true}>
      <div className="flex flex-col justify-stretch items-center space-y-8 w-full max-w-xl">
        {comments.map((comment) => (
          // TODO: extract into CommentCard component
          <div
            key={comment.id}
            className="flex bg-white text-blueGray-900 py-0 px-0 flex-col w-full mx-8"
          >
            <div className="flex justify-between items-center px-4 py-1">
              <Link
                as={`/tweets/${comment.tweetId}`}
                href={`/tweets/${comment.tweetId}`}
              >
                <span className="cursor-pointer hover:text-lightBlue-700 uppercase tracking-wide text-sm text-lightBlue-500 font-semibold">
                  Show Tweet
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

        {comments?.length === 0 && (
          <div className="text-xl text-white ">You haven't commented yet.</div>
        )}
      </div>
      {/* <div key={tweet.tweetId.toString()}>{JSON.stringify(tweet, null, 4)}</div> */}
    </Layout>
  );
}
