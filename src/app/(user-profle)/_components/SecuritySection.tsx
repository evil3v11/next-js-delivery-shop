"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

import ErrorContent from "@/app/(auth)/(registration)/_components/ErrorContent";
import LoadingContent from "@/app/(auth)/(registration)/_components/LoadingContent";
import DeleteAccountModal from "./DeleteAccountModal";

const SecuritySection = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleOpenConfirmDeleteModal = () => {
    setError(null);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseConfirmDeleteModal = () => {
    setError(null);
    setShowDeleteConfirmModal(false);
  };

  const handleProfileLogout = () => router.replace("/");

  const handleAppLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (e) {
      console.error("Не удалось выйти из приложения: ", e);
      setError("Не удалось выйти из приложения");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Ошибка при удалении пользователя");

      if (data.success) {
        logout();
        router.replace("/goodbye");
      }
    } catch (e) {
      console.error("Не удалось удалить пользователя: ", e);
      setError("Не удалось удалить пользователя");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmModal(false);
    }
  };

  if (error)
    return <ErrorContent error={error} title="Упс! Произошла ошибка." />;

  if (isLoading) <LoadingContent title="Аккаунт удаляется" />;

  return (
    <div className="flex flex-col gap-y-10 w-full">
      <h1 className="text-start font-bold text-3xl text-[#414141]">
        Безопасность
      </h1>
      <div className="flex flex-col gap-y-5 md:flex-row md:gap-x-5 justify-between">
        <button
          onClick={handleProfileLogout}
          className="py-3 w-full rounded cursor-pointer bg-[#ff6633] hover:bg-[#ff6633]/80 text-white duration-300"
        >
          Выйти из личного кабинета
        </button>
        <button
          onClick={handleAppLogout}
          className="py-3 w-full rounded cursor-pointer bg-gray-300 hover:bg-gray-200 text-[#414141] duration-300"
        >
          Выйти из приложения
        </button>
        <button
          onClick={handleOpenConfirmDeleteModal}
          className="py-3 w-full rounded cursor-pointer bg-red-300 hover:bg-red-600 text-white duration-300"
        >
          Удалить аккаунт
        </button>
      </div>
      {showDeleteConfirmModal && (
        <DeleteAccountModal
          closeModal={handleCloseConfirmDeleteModal}
          deleteAccountAction={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default SecuritySection;
