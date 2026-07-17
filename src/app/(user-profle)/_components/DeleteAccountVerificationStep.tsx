"use client";

import { Check, Loader2, Trash2 } from "lucide-react";
import AuthFormLayout from "@/app/(auth)/_components/AuthFormLayout";
import OTPResendButton from "@/app/(auth)/_components/OTPResendButton";

interface DeleteAccountVerificationStepProps {
  phoneNumber: string;
  error: string;
  onVerifyCodeAction: (e: React.SubmitEvent) => Promise<void>;
  otpCode: string;
  onOtpCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isVerifying: boolean;
  canResend: boolean;
  onResendAction: () => void;
  timeLeft: number;
}

const DeleteAccountVerificationStep = ({
  phoneNumber,
  error,
  onVerifyCodeAction,
  otpCode,
  onOtpCodeChange,
  isVerifying,
  canResend,
  onResendAction,
  timeLeft,
}: DeleteAccountVerificationStepProps) => {
  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-5 md:gap-y-10 p-10">
        <div className="flex flex-col gap-y-5 items-center text-center text-red-500">
          <Trash2 className="w-15 h-15" />
          <h1 className="text-2xl font-bold">Последнее подтверждение</h1>
          <p className="text-center font-semibold text-red-500">
            Вы собираетесь безвозвратно удалить свой аккаунт
          </p>
        </div>
        <p className="text-center">
          Введите код из SMS, отправленный на номер +{phoneNumber}
        </p>
        {error && <div>{error}</div>}
        <div className="flex flex-col gap-y-5">
          <form
            onSubmit={onVerifyCodeAction}
            autoComplete="off"
            className="flex flex-col gap-y-5 items-center md:flex-row justify-center gap-x-5"
          >
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={otpCode}
              onChange={onOtpCodeChange}
              autoComplete="one-time-code"
              required
              className="flex justify-center w-27.5 h-15 text-center text-2xl px-4 py-3 border 
              border-[#bfbfbf] rounded focus:border-primary focus:shadow-button-default 
              focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 h-15 text-red-500 font-bold bg-orange-200 hover:bg-orange-300 rounded 
              cursor-pointer duration-300 shadow-button-secondary active:shadow-button-active flex gap-x-3 
              items-center"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-5 w-5" />
                  Удаление...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Удалить аккаунт
                </>
              )}
            </button>
          </form>
          <OTPResendButton
            canResend={canResend}
            onResendAction={onResendAction}
            timeLeft={timeLeft}
          />
        </div>
      </div>
    </AuthFormLayout>
  );
};

export default DeleteAccountVerificationStep;
