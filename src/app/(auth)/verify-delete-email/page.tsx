"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { buttonStyles } from "../styles";

import { Loader2, Mail, Trash2 } from "lucide-react";
import AuthFormLayout from "../_components/AuthFormLayout";

const VerifyDeleteEmail = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      const { error: deleteError } = await authClient.deleteUser({
        callbackURL: "/goodbye",
      });

      if (deleteError) throw new Error(deleteError.message);

      setSuccess(true);
      router.replace("/");
    } catch (e) {
      console.error("Ошибка при удалении пользователя: ", e);
      setError(
        e instanceof Error ? e.message : "Ошибка при удалении пользователя",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthFormLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Проверьте Вашу почту</h1>
          <p>Мы отправили письмо с подтверждением удаления аккаунта.</p>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-10 p-10">
        <div className="flex flex-col gap-y-5 items-center text-center">
          <Trash2 className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold">
            Восстановление / <br />
            сброс пароля
          </h1>
          <p>
            Для подтверждения удаления аккаунта, мы отправим вам письмо с
            инструкциями на вашу почту, по которой вы регистрировались.
          </p>
        </div>
        {error && (
          <div className="text-red-600 rounded p-5 bg-red-100">{error}</div>
        )}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="mx-auto flex flex-col justify-center"
        >
          <button
            type="submit"
            disabled={isLoading}
            className={`${buttonStyles.active} px-3 rounded [&&]:w-full [&&]:h-10 cursor-pointer flex 
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
                Отправить подтверждение
              </>
            )}
          </button>
        </form>
      </div>
    </AuthFormLayout>
  );
};

export default VerifyDeleteEmail;
