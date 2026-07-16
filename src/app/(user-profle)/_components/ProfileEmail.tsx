"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import { authClient } from "@/lib/auth-client";
import { CONFIG } from "../../../../config/config";

import { formStyles } from "@/app/(auth)/styles";

import { Mail } from "lucide-react";
import AuthFormLayout from "@/app/(auth)/_components/AuthFormLayout";
import SuccessEmailChange from "./SuccessEmailChange";
import AlertMessage from "./AlertMessage";
import EditButton from "./ProfilePhone/EditButton";
import PhoneEditView from "./ProfilePhone/PhoneEditView";

const ProfileEmail = () => {
  const { user, fetchUserData } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

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
        await updateEmailDirectly();
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

  async function updateEmailDirectly() {
    if (user) {
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
    }
  }

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
        <input
          id="email"
          type="email"
          value={email}
          placeholder="Введите ваш e-mail"
          onChange={handleEmailChange}
          disabled={!isEditing}
          className={`${formStyles.input} w-full disabled:cursor-not-allowed disabled:bg-[#f3f2f1] mt-5`}
        />
        <Mail className="absolute right-3 top-1/2 h-5 w-5 text-gray-400" />
      </div>
      <div className="md:absolute right-0 top-0">
        {isEditing ? (
          <PhoneEditView
            isLoading={isLoading}
            onSaveAction={handleSave}
            onCancelAction={handleCancel}
          />
        ) : (
          <EditButton setEditAction={() => setIsEditing(true)} />
        )}
      </div>
      {hasNoEmail && !isEditing && (
        <AlertMessage
          type="warning"
          message="Рекомендуем добавить email для полуения уведомлений."
        />
      )}
      {isEditing && isPhoneRegistered && (
        <AlertMessage
          type="success"
          message="Вы можете изменить email без подтверждения, т.к. были зарегестрированы по телефону."
        />
      )}
      {isEditing && !isPhoneRegistered && (
        <AlertMessage
          type="warning"
          message="Для смены email потребуется подтверждение на прежнем и новом адресах."
        />
      )}
      {error && <AlertMessage type="error" message={error} />}
    </div>
  );
};

export default ProfileEmail;
