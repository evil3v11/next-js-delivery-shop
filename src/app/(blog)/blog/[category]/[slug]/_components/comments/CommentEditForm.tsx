import { useState } from "react";
import { useUpdateCommentMutation } from "@/store/redux/api/commentsApi";

import { CommentEditFormProps } from "@/app/(blog)/blog/_types";

import { Save, X } from "lucide-react";

const CommentEditForm = ({
  commentId,
  initialContent,
  userId,
  onSuccess,
  onCancel,
}: CommentEditFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");

  const [updateComment, { isLoading: isSubmitting }] = useUpdateCommentMutation();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Комментарий не может быть пустым");
      return;
    }

    if (content === initialContent) {
      onCancel();
      return;
    }

    try {
      setError("");
      const { success, message, data } = await updateComment({
        commentId,
        content,
        userId,
      }).unwrap();

      if (!success || !data) {
        setError(message ?? "Неизвестная ошибка");
        return;
      }

      onSuccess(data.content, data.editedAt ?? new Date().toISOString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка редактирования");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={1000}
        disabled={isSubmitting}
        autoFocus
        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 
        focus:border-green-500 outline-none transition-all resize-none text-sm"
      />
      <div className="flex justify-end items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={
            isSubmitting || !content.trim() || content === initialContent
          }
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 
          disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer duration-300"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 
          cursor-pointer duration-300"
        >
          <X className="w-4 h-4" />
          Отмена
        </button>
      </div>
    </form>
  );
};

export default CommentEditForm;
