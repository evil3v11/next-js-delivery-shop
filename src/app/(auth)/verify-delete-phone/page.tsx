"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTimer } from "@/hooks/useTimer";
import { useAuthStore } from "@/store/authStore";

import { authClient } from "@/lib/auth-client";
import { deleteUserAccount } from "@/utils/deleteUserAccount";

import { CONFIG } from "../../../../config/config";

import DeleteAccountInitialStep from "@/app/(user-profle)/_components/DeleteAccountInitialStep";
import DeleteAccountVerificationStep from "@/app/(user-profle)/_components/DeleteAccountVerificationStep";

const VerifyDeletePhonePage = () => {
  const { user, logout } = useAuthStore();
  const { canResend, timeLeft, startTimer } = useTimer(CONFIG.TIMEOUT_PERIOD);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const router = useRouter();

  const userId = user?.id;
  const phoneNumber = user?.phoneNumber;

  const handleSendCode = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      setError("Номер телефона не найден");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await authClient.phoneNumber.sendOtp(
        { phoneNumber },
        {
          onSuccess: () => {
            setCodeSent(true);
            setError("");
            startTimer();
          },
          onError: (ctx) =>
            setError(ctx.error.message || "Ошибка отправки кода"),
        },
      );
    } catch (e) {
      console.error("Ошибка при отправке кода: ", e);
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setOtpCode(code.trim());
    setError("");
  };

  const handleVerifyCode = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (otpCode.length !== 4 || !userId || !phoneNumber) return;

    try {
      setIsVerifying(true);
      setError("");

      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber,
        code: otpCode,
        disableSession: false,
      });

      if (verifyError) throw new Error("Неверный код подтверждения");

      await logout();
      await deleteUserAccount(userId);
      router.replace("/goodbye");
    } catch (e) {
      console.error("Ошибка при верификации кода: ", e);
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      setTimeout(() => {
        setCodeSent(false);
        setOtpCode("");
      }, 2000);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) {
      setError(`Подождите ${timeLeft} секунд перед повторной отправкой`);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await authClient.phoneNumber.sendOtp(
        { phoneNumber: phoneNumber! },
        {
          onSuccess: () => {
            setError("");
            startTimer();
          },
          onError: (ctx) =>
            setError(ctx.error.message || "Ошибка отправки кода"),
        },
      );
    } catch (e) {
      console.error("Ошибка при отправке кода: ", e);
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  if (!codeSent) {
    return (
      <DeleteAccountInitialStep
        onSendCodeAction={handleSendCode}
        isLoading={isLoading}
        canResend={canResend}
        timeLeft={timeLeft}
        error={error}
      />
    );
  }

  return (
    <DeleteAccountVerificationStep
      phoneNumber={phoneNumber || ""}
      error={error}
      onVerifyCodeAction={handleVerifyCode}
      otpCode={otpCode}
      onOtpCodeChange={handleOtpCodeChange}
      isVerifying={isVerifying}
      canResend={canResend}
      onResendAction={handleResendCode}
      timeLeft={timeLeft}
    />
  );
};

export default VerifyDeletePhonePage;
