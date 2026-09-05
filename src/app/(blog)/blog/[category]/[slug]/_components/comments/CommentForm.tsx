"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCreateCommentMutation } from "@/store/redux/api/commentsApi";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { acceptRules, checkRulesAcceptence } from "@/actions/acceptRules";

import { CommentFormProps } from "@/app/(blog)/blog/_types";

import { AlertCircle, Loader2, Send, Shield } from "lucide-react";
import Link from "next/link";
import CommentsRulesModal from "./CommentsRulesModal";

const CommentForm = ({
  articleId,
  parentId,
  closeForm,
  placeholder = "Напишите комментарий...",
}: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const modalRef = useClickOutsideModal<HTMLDivElement>(() =>
    setShowRulesModal(false),
  );

  const [createComment, { isLoading: isSubmitting }] =
    useCreateCommentMutation();

  const { user } = useAuthStore();
  const userId = user?.id;
  const userName = `${user?.lastName} ${user?.name}`;
  const userRole = user?.role ?? "user";

  useEffect(() => {
    const checkRules = async () => {
      if (userId) {
        const hasAccepted = await checkRulesAcceptence(userId);
        setRulesAccepted(hasAccepted);
      }
    };

    checkRules();
  }, [userId]);

  const handleAcceptRules = async () => {
    if (!userId) return;

    const { success, message } = await acceptRules(userId);
    if (success) {
      setRulesAccepted(true);
      setShowRulesModal(false);
    } else {
      setError(message);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!userId || !userName) {
      setError("Войдите в систему, чтобы оставить комментарий");
      return;
    }

    if (!content.trim()) {
      setError("Введите текст комментария");
      return;
    }

    if (!rulesAccepted) {
      setShowRulesModal(true);
      return;
    }

    try {
      setError("");

      const { success, data, message } = await createComment({
        articleId,
        parentId,
        content: content.trim(),
        authorId: userId,
        authorName: userName,
        authorRole: userRole,
      }).unwrap();

      if (!success || !data) {
        setError(message ?? "Неизвестная ошибка");
        return;
      }

      if (closeForm) closeForm();
      setContent("");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Ошибка при оставлении комментария к статье",
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        {!rulesAccepted ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
            <p className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Чтобы оставлять комментарии, необходимо ознакомиться с
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="text-green-600 hover:text-green-800 underline font-medium cursor-pointer"
              >
                правилами сообщества
              </button>
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
            <p className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Вы приняли
              <Link
                href="/blog/rules"
                className="text-green-600 hover:text-green-800 text-sm"
              >
                правила сообщества.
              </Link>
              Спасибо!
            </p>
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={3}
          maxLength={2000}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 
          focus:border-green-500 outline-none transition-all resize-none"
        />
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {content.length}/2000 символов
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 
            disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Отправить
              </>
            )}
          </button>
        </div>
      </form>
      {showRulesModal && (
        <CommentsRulesModal
          ref={modalRef}
          onClose={() => setShowRulesModal(false)}
          onAccept={handleAcceptRules}
        />
      )}
    </>
  );
};

export default CommentForm;
