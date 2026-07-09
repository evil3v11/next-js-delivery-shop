"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { isPasswordValid } from "@/utils/validation/isPasswordValid";

import { MailWarning } from "lucide-react";
import AuthFormLayout from "@/app/(auth)/_components/AuthFormLayout";
import PasswordInput from "@/app/(auth)/_components/PasswordInput";
import Tooltip from "@/app/(auth)/_components/Tooltip";
import ErrorContent from "@/app/(auth)/(registration)/_components/ErrorContent";
import SuccessUpdatePass from "../../_components/SuccessUpdatePass";

const EmailPasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>("");
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  // получить токен из searchParams можно только после монтирования компонента PasswordResetPage
  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get("token");
    if (!queryToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Недействительная ссылка для сброса пароля");
      return;
    }

    setToken(queryToken);
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setNewPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setError(null);
    setConfirmNewPassword(e.target.value);
  };

  const handleToStart = () => router.replace("/login");

  if (error && !token) {
    return (
      <AuthFormLayout>
        <ErrorContent
          title="Что-то пошло не так!"
          error={error}
          icon={<MailWarning className="h-8 w-8 text-red-500" />}
          secondaryAction={{
            label: (
              <>
                Запросить новую ссылку
                <br />
                для сброса пароля
              </>
            ),
            onClick: handleToStart,
          }}
        />
      </AuthFormLayout>
    );
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isPasswordValid(newPassword)) {
      setError(
        "Пароль должен содержать: 6+ символов, заглавные и строчные буквы, а также цифры",
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Пароли должны совпадать");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (!token) throw new Error("Токен для сброса пароля отсутствует");

      const { error: resetError } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (resetError) throw new Error(resetError.message);
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) return <SuccessUpdatePass />;

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-10 p-10">
        <h1 className="text-2xl font-bold text-center">
          Установите новый пароль
        </h1>
        {error && <Tooltip text={error} />}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex flex-col gap-y-5 justify-center items-center"
        >
          <PasswordInput
            id="newPassword"
            label="Новый пароль"
            value={newPassword}
            onChangeAction={handlePasswordChange}
            showPassword={showPassword}
            togglePasswordVisibilityAction={() =>
              setShowPassword(!showPassword)
            }
            inputClass={
              newPassword.length > 0 && !isPasswordValid(newPassword)
                ? "border-red-500"
                : ""
            }
          />
          <PasswordInput
            id="confirmNewPassword"
            label="Подтвердите пароль"
            value={confirmNewPassword}
            onChangeAction={handleConfirmPasswordChange}
            showPassword={showConfirmPassword}
            togglePasswordVisibilityAction={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            compareWith={newPassword}
            inputClass={
              confirmNewPassword.length > 0 &&
              newPassword !== confirmNewPassword
                ? "border-red-500"
                : ""
            }
          />
          <button
            type="submit"
            disabled={isLoading || (!newPassword && !confirmNewPassword)}
            className={`px-8 py-2 hover:bg-primary/80 text-white hover:shadow-button-default 
              active:shadow-button-active rounded duration-300 cursor-pointer ${isLoading ? "bg-[#e5ffde]" : "bg-primary"}`}
          >
            {isLoading ? "Сохраняем пароль.." : "Сохранить новый пароль"}
          </button>
        </form>
      </div>
    </AuthFormLayout>
  );
};

export default EmailPasswordResetPage;
