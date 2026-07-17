"use client";

import AuthFormLayout from "@/app/(auth)/_components/AuthFormLayout";
import { Loader2, Mail, Trash2 } from "lucide-react";

interface DeleteAccountInitialStepProps {
  onSendCodeAction: (e: React.SubmitEvent) => Promise<void>;
  isLoading: boolean;
  canResend: boolean;
  timeLeft: number;
  error: string;
}

const DeleteAccountInitialStep = ({
  onSendCodeAction,
  isLoading,
  canResend,
  timeLeft,
  error,
}: DeleteAccountInitialStepProps) => {
  return (
    <AuthFormLayout>
      <div className="flex flex-col items-center gap-y-10 p-10">
        <div className="flex flex-col items-center gap-y-5">
          <Trash2 className="h-12 w-12 text-red-500" />
          <h2 className="text-3xl font-bold">Удаление аккаунта</h2>
        </div>
        <p className="font-semibold text-red-500 text-center">
          Внимание! Это действие необратимо. Все Ваши данные будут удалены без
          возможности восстановления.
        </p>
        <p className="text-[#414141] text-center">
          Для подтверждения удаления аккаунта, мы отправим SMS с кодом на
          телефон, по которому вы регистрировались.
        </p>
        {error && <div className="bg-red-50 text-red-500">{error}</div>}
        <form onSubmit={onSendCodeAction} autoComplete="off">
          <button
            type="submit"
            disabled={isLoading || !canResend}
            className="bg-red-200 hover:bg-red-300 text-red-500 font-bold px-4 py-2 cursor-pointer 
            rounded flex gap-x-3 items-center duration-300 shadow-button-secondary active:shadow-button-active"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Отправка...
              </>
            ) : !canResend ? (
              `Подождите ${timeLeft} сек.`
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Получить код подтверждения
              </>
            )}
          </button>
        </form>
      </div>
    </AuthFormLayout>
  );
};

export default DeleteAccountInitialStep;
