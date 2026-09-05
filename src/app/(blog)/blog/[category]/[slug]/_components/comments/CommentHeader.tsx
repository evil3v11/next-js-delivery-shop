import { CommentHeaderProps } from "@/app/(blog)/blog/_types";

import { formatCommentDate } from "../../../_utils/formatCommentDate";
import { getAuthorBadges } from "../../../_utils/getAuthorBadges";

import { Edit, Trash2 } from "lucide-react";
import CommentAvatar from "./CommentAvatar";

const CommentHeader = ({
  comment,
  canEdit,
  canDelete,
  isEditing,
  onEdit,
  onDelete,
  isDeleting,
  deleteButtonTitle,
}: CommentHeaderProps) => {
  const authorBadges = getAuthorBadges(comment)
  const formattedDate = formatCommentDate(String(comment.createdAt));

  return (
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <CommentAvatar
          authorId={comment.authorId}
          authorName={comment.authorName}
        />
        <div>
          <div className="font-medium text-gray-900 flex items-center gap-2 flex-wrap">
            <span>{comment.authorName}</span>
            {authorBadges.map((badge, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}
              >
                {badge.text}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            {formattedDate}
            {comment.isEdited && comment.editedAt && (
              <> (изменено {formattedDate})</>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {canEdit && !isEditing && (
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-green-600 cursor-pointer duration-300"
            title="Редактировать"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        {canDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50 cursor-pointer duration-300"
            title={deleteButtonTitle}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentHeader;
