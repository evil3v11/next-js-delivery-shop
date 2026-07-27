"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import { useScrollModalToCenter } from "@/hooks/useScrollModalToCenter";

import { formStyles } from "@/app/(auth)/styles";

import { Key, LucideArrowRight } from "lucide-react";

const ProfilePassword = () => {
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useClickOutsideModal<HTMLDivElement>(() => setIsModalOpen(false))
  const router = useRouter();
  useScrollModalToCenter(modalRef, isModalOpen)

  const isPhoneRegistered = user?.phoneNumberVerified;


  const handleModalOpen = () => setIsModalOpen(true);

  const handleChangePassword = async () => {
    setIsModalOpen(false);
    await logout();
    if (isPhoneRegistered) {
      router.replace("/phone-pass-reset");
    } else {
      router.replace("/forgot-password");
    }
  };

  const getModalText = () => {
    return isPhoneRegistered
      ? "Для смены пароля будет использована SMS-верификация. Вы будете выведены из аккаунта.\nПродолжить?"
      : "Для смены пароля будет отправлено письмо с инструкциями на ваш email. Вы будете выведены из аккаунта.\nПродолжить?";
  };

  return (
    <>
      <div className="flex flex-col gap-y-5 items-c w-full relative">
        <h2 className="text-xl font-bold text-main-text">Пароль</h2>
        <div className="relative">
          <input
            type="password"
            disabled
            value="********"
            readOnly
            className={`${formStyles.input} w-full disabled:cursor-not-allowed disabled:bg-[#f3f2f1] mt-5 disabled:text-gray-400`}
          />
          <Key className="absolute right-3 top-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="md:absolute right-0 top-0 flex justify-center">
          <button
            className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded cursor-pointer 
          duration-300 font-bold flex items-center group"
            onClick={handleModalOpen}
          >
            Сменить пароль
            <LucideArrowRight className="w-5 h-5 ml-2 -translate-x-1 group-hover:translate-x-1 duration-300" />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="absolute inset-0 bg-secondary/50 shadow-banner-orange backdrop-blur-lg rounded-lg 
        flex justify-center items-center p-5 z-50"
        >
          <div
            ref={modalRef}
            className="bg-[#f3f2f1] rounded p-10 flex flex-col gap-y-5"
          >
            <div className="text-main-text flex flex-col gap-y-5">
              <h2 className="text-2xl font-bold ">Подверждение смены пароля</h2>
              <p>{getModalText()}</p>
            </div>
            <div className="flex justify-center md:justify-end gap-x-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-600 duration-300"
              >
                Отмена
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 rounded cursor-pointer bg-primary hover:bg-green-600 text-white duration-300"
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePassword;
