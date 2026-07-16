"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getAvatarByGender } from "@/utils/getAvatarByGender";

import { checkAvatarExistence } from "@/utils/avatarUtils";

interface UseAvatarProps {
  userId?: string;
  gender: string;
}

export const useAvatar = ({ userId, gender = "male" }: UseAvatarProps) => {
  const { fetchUserData } = useAuthStore();
  const [currentAvatar, setCurrentAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDisplayedAvatar = useCallback(
    () => currentAvatar || getAvatarByGender(gender),
    [currentAvatar, gender],
  );

  const loadAvatar = useCallback(async () => {
    if (!userId) {
      setCurrentAvatar(getAvatarByGender(gender));
      return;
    }

    try {
      setIsLoading(true);
      const exists = await checkAvatarExistence(userId);

      if (exists) {
        const response = await fetch(
          `/api/users/avatar/${userId}?t=${Date.now()}`,
        );
        if (!response.ok) setCurrentAvatar(getAvatarByGender(gender));

        const blob = await response.blob();
        if (blob.size > 0) {
          const avatarUrl = URL.createObjectURL(blob);
          setCurrentAvatar(avatarUrl);
          return;
        }
      } else {
        setCurrentAvatar(getAvatarByGender(gender));
      }
    } catch (e) {
      console.error("Ошибка загрузки аватара: ", e);
      setCurrentAvatar(getAvatarByGender(gender));
    } finally {
      setIsLoading(false);
    }
  }, [userId, gender]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAvatar();
  }, [loadAvatar]);

  useEffect(() => {
    return () => {
      if (currentAvatar && currentAvatar.startsWith("blob:")) {
        URL.revokeObjectURL(currentAvatar);
      }
    };
  }, [currentAvatar]);

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!userId) throw new Error("Нужен идентификатор пользователя");
      if (!file.type.startsWith("image/"))
        throw new Error("Пожалуйста, выберите изображение");
      if (file.size > 5 * 1024 * 1024)
        throw new Error("Размер файла не может превышать более 5 МБ");

      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("userId", userId);

        const response = await fetch("/api/users/upload-avatar", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Ошибка загрузки аватара");

        await loadAvatar();
        await fetchUserData();
        return true;
      } catch (e) {
        console.error("Не удалось загрузить аватар: ", e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, loadAvatar, fetchUserData],
  );

  return {
    avatar: currentAvatar,
    displayAvatar: getDisplayedAvatar(),
    isUploading: isLoading,
    loadAvatar,
    uploadAvatar,
  };
};
