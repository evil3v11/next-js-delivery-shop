"use client";

import { CommentActionsProps } from "@/app/(blog)/blog/_types";
import { Heart, Reply } from "lucide-react";

const CommentActions = ({
  isLiked,
  likeCount,
  onLike,
  isLiking,
  currentUserId,
  canReply,
  onReply,
}: CommentActionsProps) => (
  <div className="flex items-center gap-4 text-sm">
    <button
      onClick={onLike}
      disabled={isLiking || !currentUserId}
      className={`flex items-center gap-1 cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
      ${isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"}`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      <span>{likeCount}</span>
    </button>
    {canReply && (
      <button
        onClick={onReply}
        className="text-gray-500 hover:text-green-600 flex items-center gap-1 cursor-pointer duration-300"
      >
        <Reply className="w-4 h-4" />
        Ответить
      </button>
    )}
  </div>
);

export default CommentActions;
