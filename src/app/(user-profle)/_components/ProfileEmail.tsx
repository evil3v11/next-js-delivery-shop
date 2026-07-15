"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import { authClient } from "@/lib/auth-client";
import { CONFIG } from "../../../../config/config";

import { formStyles } from "@/app/(auth)/styles";

import { AlertCircle, Edit, Mail } from "lucide-react";
import AuthFormLayout from "@/app/(auth)/_components/AuthFormLayout";
import SuccessEmailChange from "./SuccessEmailChange";
import { useRouter } from "next/navigation";

const ProfileEmail = () => {
  const { user, fetchUserData, logout } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const router = useRouter();

  const isTempEmail = user?.email.endsWith(CONFIG.TEMP_EMAIL_DOMAIN);
  const hasNoEmail = !user?.email || user.email.trim() === "" || isTempEmail;
  const isPhoneRegistered = user?.phoneNumberVerified === true;

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(isTempEmail ? "" : user.email || "");
    }
  }, [user, isTempEmail]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleCancel = () => {
    setEmail(isTempEmail ? "" : user?.email || "");
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (!user) return;

    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegExp.test(email.trim())) {
      setError("Пожалуйста, введите корректный email.");
      return;
    }

    const currentlyDisplayedEmail = isTempEmail ? "" : user.email || "";
    if (email === currentlyDisplayedEmail) {
      setError("Новый email совпадает с текущим.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      if (isPhoneRegistered) {
        const response = await fetch("/api/users/update-email", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId: user.id, email }),
        });

        const data = await response.json();
        if (data.error) {
          setError(data.error);
          return;
        }

        await fetchUserData();
      } else {
        const { error: changeEmailError } = await authClient.changeEmail({
          newEmail: email,
          callbackURL: "/login",
        });

        if (changeEmailError) {
          if (changeEmailError.code === "COULDNT_UPDATE_YOUR_EMAIL") {
            throw new Error("Этот email уже используется другим пользователем");
          } else
            throw new Error(
              changeEmailError.message || "Ошибка при изменении email",
            );
        }
        
        setShowSuccess(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить email");
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  if (showSuccess)
    return (
      <AuthFormLayout>
        <SuccessEmailChange email={user?.email || ""} newEmail={email} />
      </AuthFormLayout>
    );

  return (
    <div className="flex flex-col gap-y-5 w-full relative">
      <h2 className="text-xl font-bold text-[#414141]">E-mail</h2>
      <div className="relative">
        {error && (
          <div className="flex items-center bg-red-50 text-red-700 px-3 py-2 rounded-lg mb-3">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        <input
          id="email"
          type="email"
          value={email}
          placeholder="Введите ваш e-mail"
          onChange={handleEmailChange}
          disabled={!isEditing}
          className={`${formStyles.input} w-full disabled:cursor-not-allowed mt-5`}
        />
        <Mail className="absolute right-3 top-1/2 h-5 w-5 text-gray-400" />
      </div>
      <div className="md:absolute right-0 top-0">
        {isEditing ? (
          <div className="flex justify-center gap-x-5">
            <button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded cursor-pointer 
              duration-300 flex-1"
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-pointer 
              duration-300 flex-1"
            >
              Отмена
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#ff6633] hover:bg-[#ff6633]/80 text-white px-4 py-2 rounded cursor-pointer 
              duration-300 font-bold flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </button>
          </div>
        )}
      </div>
      {hasNoEmail && !isEditing && (
        <div className="flex items-center bg-amber-50 text-amber-500 px-3 py-2 rounded-lg mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">
            Рекомендуем добавить email для получения уведомлений о скидках.
          </span>
        </div>
      )}
      {isEditing && isPhoneRegistered && (
        <div className="flex items-center bg-green-50 text-primary px-3 py-2 rounded-lg mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">
            Вы можете изменить email без подтверждения, т.к. зарегестрированы по
            телефону.
          </span>
        </div>
      )}
      {isEditing && !isPhoneRegistered && (
        <div className="flex items-center bg-orange-50 text-[#ff6633] px-3 py-2 rounded-lg mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">
            Для смены email потребуется подтверждение на прежнем и новом
            адресах.
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileEmail;
