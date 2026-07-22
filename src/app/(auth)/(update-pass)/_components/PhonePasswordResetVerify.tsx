"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { isPasswordValid } from "@/utils/validation/isPasswordValid";

import { buttonStyles } from "../../styles";
import { Loader2, MessageCircle } from "lucide-react";

import AuthFormLayout from "../../_components/AuthFormLayout";
import PasswordInput from "../../_components/PasswordInput";
import SuccessUpdatePass from "./SuccessUpdatePass";

interface PhonePasswordResetVerifyProps {
  phone: string;
  isLoading: boolean;
  setLoadingAction: (isLoading: boolean) => void;
  error: string | null;
  setErrorAction: (error: string | null) => void;
  onBackAction: () => void;
}

const PhonePasswordResetVerify = ({
  phone,
  isLoading,
  setLoadingAction,
  error,
  setErrorAction,
  onBackAction,
}: PhonePasswordResetVerifyProps) => {
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [closeForm, setCloseForm] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setErrorAction(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setErrorAction(null);
  };

  const handleToLogin = () => router.replace("/login");

  const handleResetPassword = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setLoadingAction(true);
      setErrorAction(null);

      const { error: resetPassError } =
        await authClient.phoneNumber.resetPassword({
          otp,
          phoneNumber: phone.replace(/\D/g, ""),
          newPassword,
        });

      if (resetPassError) {
        if (resetPassError.message?.includes("Invalid OTP")) {
          setOtp("");
          throw new Error("Неверный код подтверждения");
        } else if (resetPassError.message?.includes("Too many attempts")) {
          setCloseForm(true);
          throw new Error(
            "Превышено количество попыток. Перейдите на страницу входа, чтобы попробовать снова",
          );
        } else if (
          resetPassError.message?.includes("OTP expired") ||
          resetPassError.message?.includes("OTP not found")
        ) {
          setCloseForm(true);
          throw new Error(
            "Просроченный или недействительный код подтверждения.\nПерейдите на страницу входа, чтобы попробовать снова",
          );
        }

        throw new Error(resetPassError.message || "Неверный OTP код");
      }

      const response = await fetch("/api/auth/reset-phone-pass", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone.replace(/\D/g, ""),
          password: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Не удалось обновить пароль");

      setSuccess(true);
      setTimeout(() => router.replace("/login"), 3000);
    } catch (e) {
      setErrorAction(e instanceof Error ? e.message : "Произошла ошибка");
    } finally {
      setLoadingAction(false);
    }
  };

  if (success) return <SuccessUpdatePass />;

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-5 p-10">
        <div className="flex flex-col items-center">
          <MessageCircle className="w-12 h-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold">Введите код из SMS</h1>
        </div>
        <p className="text-center">
          Мы отправили 4-значный код на номер:
          <br />
          <span className="text-secondary font-medium">{phone}</span>
        </p>
        {error && (
          <div className="p-3 bg-red-100 text-red-500 rounded text-sm text-center">
            {error}
          </div>
        )}
        {error &&
          (error.includes("Превышено количество попыток") ||
            error.includes("Просроченный или недействительный код")) && (
            <button
              onClick={handleToLogin}
              className="text-primary hover:underline text-sm mx-auto cursor-pointer"
            >
              Перейти на страницу входа
            </button>
          )}
        <button
          type="button"
          onClick={onBackAction}
          className="text-primary hover:underline text-sm mx-auto cursor-pointer"
        >
          Изменить номер телефона
        </button>
        {!closeForm && (
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col gap-y-4 mx-auto"
          >
            <div className="flex flex-col items-">
              <p className="text-center text-[#8f8f8f]">Код из SMS</p>
              <input
                type="password"
                id="otp"
                pattern="[0-9]{4}"
                maxLength={4}
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={handleOtpChange}
                className="flex justify-center w-27.5 h-15 mx-auto text-center px-4 py-3 border 
              border-[#bfbfbf] rounded focus:border-primary focus:shadow-button-default 
              focus:bg-white focus:outline-none"
                required
              />
            </div>
            <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 relative">
              <div className="flex flex-col items-start relative">
                <PasswordInput
                  id="password"
                  label="Новый пароль"
                  value={newPassword}
                  onChangeAction={handlePasswordChange}
                  showPassword={showNewPassword}
                  togglePasswordVisibilityAction={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                  showRequirements={true}
                  inputClass={`h-15 ${
                    newPassword.length > 0 && !isPasswordValid(newPassword)
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`${buttonStyles.active} rounded [&&]:w-full [&&]:h-10 cursor-pointer flex 
            items-center justify-center gap-2 ${isLoading ? "bg-[#fcd5ba]" : ""}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Созранение...
                </>
              ) : (
                "Установить новый пароль"
              )}
            </button>
          </form>
        )}
      </div>
    </AuthFormLayout>
  );
};

export default PhonePasswordResetVerify;
