import { memo } from "react";
import { CommentsListProps } from "../_types";

import Loader from "@/components/Loader";
import CommentRow from "./CommentRow";

const CommentsList = memo(function CommentsList({
  comments,
  isLoading,
  deletingId,
  onDelete,
}: CommentsListProps) {
  if (isLoading) return <Loader />;

  if (!comments.length) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">Нет комментариев за выбранный период</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="flex-1 justify-center bg-white rounded border border-gray-100 shadow-sm hover:shadow-md 
          transition-shadow duration-300"
        >
          <div className="flex-1 justify-center hover:bg-gray-50">
            <CommentRow
              comment={comment}
              deletingId={deletingId}
              onDelete={onDelete}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

export default CommentsList;
