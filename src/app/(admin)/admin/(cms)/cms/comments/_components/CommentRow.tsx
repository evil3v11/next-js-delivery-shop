import { memo, useCallback, useEffect, useState } from "react";
import { useCommentsStore } from "@/store/commentsStore";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { banUser, checkBan, unbanUser } from "@/actions/userBanActions";

import { checkAvatarExistence } from "@/utils/avatarUtils";
import { getAvatarByGender } from "@/utils/getAvatarByGender";
import { formatLocaleDate } from "@/utils/formatLocaleDate";

import { CommentRowProps } from "../_types";

import { Ban, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BanUserModal from "./BanUserModal";

const CommentRow = memo(function CommentRow({ comment, deletingId, onDelete }: CommentRowProps) {
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [authorGender, setAuthorGender] = useState<string>("");
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);

  const modalRef = useClickOutsideModal<HTMLDivElement>(() =>
    setShowBanModal(false),
  );

  const { bannedUsers, setBannedUsers } = useCommentsStore();

  useEffect(() => {
    const checkBanStatus = async () => {
      if (bannedUsers[comment.authorId]) return;
      try {
        const { isBanned, bannedUntil } = await checkBan(comment.authorId);
        if (isBanned) setBannedUsers(comment.authorId, isBanned ?? false, bannedUntil);
      } catch (e) {
        console.error(`Ошибка при проверки статуса бана: ${e}`);
      }
    };

    checkBanStatus();
  }, [comment.authorId, bannedUsers, setBannedUsers]);

  useEffect(() => {
    const fetchAuthorGender = async () => {
      if (!comment.authorId) return;

      try {
        const response = await fetch(`/api/blog/user/${comment.authorId}`);
        const { success, data } = await response.json();

        if (success) setAuthorGender(data.gender);
      } catch (e) {
        console.error(`Ошибка загрузки данных автора: ${e}`);
      }
    };

    fetchAuthorGender();
  }, [comment.authorId]);

  useEffect(() => {
    const getAvatar = async () => {
      try {
        setIsAvatarLoading(true);
        if (comment.authorId) {
          const avatarExists = await checkAvatarExistence(comment.authorId);
          if (avatarExists) {
            setAvatarSrc(`/api/users/avatar/${comment.authorId}`);
          } else if (authorGender) {
            setAvatarSrc(getAvatarByGender(authorGender));
          }
        }
      } catch {
        setAvatarSrc(getAvatarByGender(authorGender));
      } finally {
        setIsAvatarLoading(false);
      }
    };

    getAvatar();
  }, [comment.authorId, authorGender]);
  
  const userBanData = bannedUsers[comment.authorId];
  const isBanned = userBanData?.isBanned;
  const bannedUntil = userBanData?.bannedUntil;

  const handleAvatarError = () => {
    if (authorGender) setAvatarSrc(getAvatarByGender(authorGender));
    else setAvatarSrc("/icons-avatar/avatar-default.svg");
  };

  const handleBan = useCallback(async (banDays: number | null) => {
    try {
      const { success, message, bannedUntil } = await banUser(
        comment.authorId,
        banDays,
      );
      if (success && bannedUntil) {
        setBannedUsers(comment.authorId, true, bannedUntil);
        alert(message);
      } else alert(message ?? "Ошибка при бане пользователя");
    } catch (e) {
      console.error(`Ошибка при бане пользователя: ${e}`);
      alert(`Ошибка при бане пользователя: ${e}`);
    } finally {
      setShowBanModal(false);
    }
  }, [comment.authorId, setBannedUsers]);

  const handleUnban = useCallback(async () => {
    try {
      const { success, message } = await unbanUser(comment.authorId);
      if (success) {
        setBannedUsers(comment.authorId, false, null);
        alert(message);
      } else alert(message ?? "Ошибка при разбане пользователя");
    } catch (e) {
      console.error(`Ошибка при разбане пользователя: ${e}`);
      alert(`Ошибка при разбане пользователя: ${e}`);
    } finally {
      setShowBanModal(false);
    }
  }, [setBannedUsers, comment.authorId]);

  return (
    <>
      <div
        className="grid md:grid-cols-[48px_90px_140px_100px_80px_100px] lg:grid-cols-[48px_120px_300px_120px_80px_120px] 
      xl:grid-cols-[48px_160px_300px_150px_200px_140px] gap-2 lg:gap-4 px-2 py-3 items-center justify-center 
      md:justify-between"
      >
        <div className="flex justify-center overflow-hidden shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {isAvatarLoading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            ) : (
              <Image
                src={avatarSrc || "/icons-avatar/avatar-default.svg"}
                alt={comment.authorName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                onError={handleAvatarError}
              />
            )}
          </div>
        </div>
        <button
          onClick={() => setShowBanModal(true)}
          title={isBanned ? "Пользователь заблокирован" : "Заблокировать пользователя"}
          className="text-sm font-medium text-gray-900 hover:text-green-600 hover:underline text-left 
          duration-300 cursor-pointer"
        >
          {comment.authorName}
          {isBanned && (
            <p className="text-[10px] text-red-600 text-left ">
              (заблокирован)
            </p>
          )}
        </button>
        <div className="text-sm text-gray-900">{comment.content}</div>
        <div className="text-sm">
          <span className="md:hidden">Статья: </span>
          <Link
            href={`/blog/${comment.categorySlug}/${comment.articleSlug}`}
            target="_blank"
            className="text-green-600 hover:text-green-800 hover:underline"
          >
            {comment.articleName}
          </Link>
        </div>
        <div className="text-sm text-gray-600 md:text-center">
          {formatLocaleDate(String(comment.createdAt))}
        </div>
        <div className="flex justify-center gap-1">
          <button
            onClick={() => setShowBanModal(true)}
            title={isBanned ? "Управление блокировкой" : "Заблокировать пользователя"}
            className={`p-1.5 cursor-pointer duration-300 ${isBanned ? "text-red-600 hover:text-red-800" : "text-gray-400 hover:text-red-600"}`}
          >
            <Ban className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(comment._id)}
            disabled={deletingId === comment._id}
            title="Удалить комментарий"
            className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50 cursor-pointer duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showBanModal && (
        <BanUserModal
          ref={modalRef}
          onClose={() => setShowBanModal(false)}
          onBan={handleBan}
          onUnban={handleUnban}
          userName={comment.authorName}
          userId={comment.authorId}
          isBanned={isBanned}
          bannedUntil={bannedUntil}
        />
      )}
    </>
  );
});

export default CommentRow;
