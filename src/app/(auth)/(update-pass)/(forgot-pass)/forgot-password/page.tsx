"use client";

import { useState } from "react";

import { buttonStyles, formStyles } from "@/app/(auth)/styles";
import { KeyRound, Loader2, Mail } from "lucide-react";

import AuthFormLayout from "@/app/(auth)/_components/AuthFormLayout";
import { authClient } from "@/lib/auth-client";
import SuccessSentEmail from "../../_components/SuccessSentEmail";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const { error: resetPassError } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/email-pass-reset`,
      });

      if (resetPassError) throw new Error(resetPassError.message);

      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сброса пароля");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) return <SuccessSentEmail email={email} />;

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-8 p-10">
        <div className="flex flex-col items-center">
          <KeyRound className="w-12 h-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold">Восстановление пароля</h1>
        </div>
        <p>
          Введите email, по которому проходила регистрация, и мы вышлем Вам
          инструкции по сбросу пароля.
        </p>
        {error && (
          <div className="text-red-600 rounded p-5 bg-red-100">{error}</div>
        )}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="mx-auto flex flex-col justify-center"
        >
          <div className="flex flex-col justify-center">
            <label htmlFor="email">
              Введите ваш e-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={formStyles.input}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`${buttonStyles.active} rounded [&&]:w-full [&&]:h-10 [&&]:mt-8 cursor-pointer flex 
            items-center justify-center gap-2 ${isLoading ? "bg-[#fcd5ba]" : ""}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Отправка...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Отправить инструкции
              </>
            )}
          </button>
        </form>
      </div>
    </AuthFormLayout>
  );
};

export default ForgotPasswordPage;
