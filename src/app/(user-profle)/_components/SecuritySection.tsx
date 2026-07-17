"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

import ErrorContent from "@/app/(auth)/(registration)/_components/ErrorContent";
import DeleteAccountModal from "./DeleteAccountModal";

const SecuritySection = () => {
  const { user, logout } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (modalRef.current && showDeleteConfirmModal) {
      modalRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [showDeleteConfirmModal]);

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

  const handleDeleteAccount = () => {
    if (!user) return;

    if (user.phoneNumberVerified) {
      router.push("/verify-delete-phone");
    } else {
      router.push("/verify-delete-email");
    }
  };

  if (error)
    return <ErrorContent error={error} title="Упс! Произошла ошибка." />;

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
          modalRef={modalRef}
          closeModal={handleCloseConfirmDeleteModal}
          deleteAccountAction={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default SecuritySection;
