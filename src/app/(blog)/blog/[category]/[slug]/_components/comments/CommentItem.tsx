import { Activity, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from "@/store/redux/api/commentsApi";

import { getDeleteButtonTitle } from "../../../_utils/getDeleteButtonTitle";

import { CommentItemProps } from "@/app/(blog)/blog/_types";

import CommentHeader from "./CommentHeader";
import CommentEditForm from "./CommentEditForm";
import CommentActions from "./CommentActions";
import CommentForm from "./CommentForm";
import CommentReplies from "./CommentReplies";

const CommentItem = ({ comment, articleId, depth = 2 }: CommentItemProps) => {
  const [currentContent, setCurrentContent] = useState(comment.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes.length);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const { user } = useAuthStore();
  const currentUserId = user?.id ?? String(user?._id) ?? "";
  const currentUserRole = user?.role ?? "user";
  const isAdminOrManager = currentUserRole !== "user";

  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const [addLike, { isLoading: isLiking }] = useLikeCommentMutation();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentContent(comment.content);
  }, [comment.content]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLiked(currentUserId ? comment.likes.includes(currentUserId) : false);
  }, [currentUserId, comment.likes]);

  const canDelete =
    (currentUserId && currentUserId === comment.authorId) || isAdminOrManager;
  const canEdit = currentUserId === comment.authorId;
  const canReply = depth < 3;

  const deleteButtonTitle = getDeleteButtonTitle(
    currentUserId,
    currentUserRole,
    comment.articleId,
  );

  const handleDeleteComment = async () => {
    if (!canDelete || isDeleting) return;
    if (!confirm("Удалить этот комментарий?")) return;

    try {
      await deleteComment(comment._id).unwrap();
    } catch (e) {
      console.error("Ошибка при удалении комментария: ", e);
    }
  };

  const handleEditSuccess = (newContent: string) => {
    setCurrentContent(newContent);
    setIsEditing(false);
  };

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;

    try {
      const { success, data } = await addLike({
        commentId: comment._id,
        userId: currentUserId,
      }).unwrap();

      if (success && data) {
        setLikeCount(data.likeCount);
        setIsLiked(data.isLiked);
      }
    } catch (e) {
      console.error("Ошибка при проставлении лайка: ", e);
    }
  };

  return (
    <div className={`${depth > 0 ? "ml-4 md:ml-8 pl-4 border-l-2 border-gray-200" : ""} mb-5`}>
      <div className="bg-white rounded p-4 mb-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <CommentHeader
          comment={comment}
          canEdit={canEdit}
          canDelete={canDelete}
          isEditing={isEditing}
          isDeleting={isDeleting}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDeleteComment}
          deleteButtonTitle={deleteButtonTitle}
        />
        <div className="mb-3">
          {isEditing ? (
            <CommentEditForm
              commentId={comment._id}
              initialContent={currentContent}
              userId={currentUserId || ""}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap wrap-break-word">
              {currentContent}
            </p>
          )}
        </div>
        <CommentActions
          isLiked={isLiked}
          likeCount={likeCount}
          onLike={handleLike}
          isLiking={isLiking}
          currentUserId={currentUserId}
          canReply={canReply}
          onReply={() => setShowReplyForm(!showReplyForm)}
        />
      </div>
      <Activity mode={showReplyForm ? "visible" : "hidden"}>
        <CommentForm
          articleId={articleId}
          parentId={comment._id}
          closeForm={() => setShowReplyForm(false)}
          placeholder={`Ответ ${comment.authorName}`}
        />
      </Activity>
      <CommentReplies
        replies={comment.replies}
        articleId={articleId}
        depth={depth}
      />
    </div>
  );
};

export default CommentItem;
