/**
 * This Component shows the button/icon for a user to "like" a comment
 * It also shows how many likes the comment currently has
 * The button will be highlighted a different color if the current user has already liked the comment
 * If the user clicks the button and the comment is currently already liked by them, it will unlike the comment
 */

import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { Button } from "../UI/Button";

import { useAuth } from "../../hooks/useAuth";
import { CommentLike } from "../../schema/CommentLike";
import {
  createNewCommentLike,
  deleteCommentLike,
  getAllCommentLikes,
} from "../../crud/commentLikes";

interface PropType extends JSX.IntrinsicAttributes {
  commentId: number;
}

export const CommentLikeButton: FunctionComponent<PropType> = ({
  commentId,
  ...props
}) => {
  const { user } = useAuth();

  const router = useRouter;
  const [loading, setLoading] = useState(true);
  const [commentIsLikedByUser, setCommentIsLikedByUser] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Array<CommentLike>>([]);

  useEffect(() => {
    (async () => {
      const { value: likes, error } = await getAllCommentLikes(commentId);
      setCommentLikes(likes);
      if (error) throw new Error(error.errorMessageUI);

      likes.forEach((like) => {
        if (like.userId === user.id) {
          setCommentIsLikedByUser(true);
        }
      });
      setLoading(false);
    })().catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const likeComment = async () => {
    if (commentIsLikedByUser === true) {
      // Unlike the comment
      await deleteCommentLike({ commentId });
      setCommentIsLikedByUser(false);
      setCommentLikes([
        ...commentLikes.filter((like) => like.userId !== user.id),
      ]);
    } else {
      // Like the comment
      await createNewCommentLike({ commentId });
      setCommentIsLikedByUser(true);
      setCommentLikes([
        ...commentLikes,
        { commentId: commentId, userId: user.id, username: user.username },
      ]);
    }
  };

  return loading === true ? (
    <Button className="ml-0" color="white" disabled>
      <LoadingSpinner />
    </Button>
  ) : (
    <Button
      animated
      className={`ml-0 ${
        commentIsLikedByUser
          ? "text-white "
          : "text-blueGray-700 hover:text-white"
      } `}
      color={commentIsLikedByUser ? "blue" : "white"}
      title="Like Comment"
      onClick={likeComment}
    >
      <svg
        className="w-4 h-4 cursor-pointer transform translate-y-1"
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

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 transform -translate-x-1 -translate-y-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
      <span>{commentLikes.length}</span>
      {/* ({commentIsLikedByUser && <span>Is Liked</span>}) */}
    </Button>
  );
};
