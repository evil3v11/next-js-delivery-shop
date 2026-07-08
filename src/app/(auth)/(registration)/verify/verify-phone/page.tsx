"use client";

import { authClient } from "@/lib/auth-client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegFormContext } from "@/app/contexts/RegFormContext";

import { PhoneOff } from "lucide-react";
import AuthFormLayout from "@/app/(auth)/_components/AuthFormLayout";
import LoadingContent from "../../_components/LoadingContent";
import ErrorContent from "../../_components/ErrorContent";
import EnterOTPCode from "@/app/(auth)/(registration)/_components/EnterOTPCode";

const VerifyPhonePage = () => {
  const { regFormData } = useRegFormContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const hasSentInitialRequest = useRef(false);
  const router = useRouter();
  const phoneNumber = regFormData.phoneNumber;

  const checkExistingPhoneNumber = async (
    phoneNumber: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/auth/check-phone`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) throw new Error("Ошибка проверки номера");
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Ошибка проверки номера", error);
      return false;
    }
  };

  const verifyAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const phoneAlreadyExists = await checkExistingPhoneNumber(phoneNumber);
      if (phoneAlreadyExists)
        throw new Error(
          "Этот номер телефона уже используется. Попробуйте войти.",
        );

      await authClient.phoneNumber.sendOtp(
        { phoneNumber },
        {
          onSuccess: () => {
            setVerificationSent(true);
            setIsLoading(false);
          },
          onError: (ctx) => {
            setIsLoading(false);
            setVerificationSent(false);
            setError(ctx.error?.message || "Ошибка при отправке SMS");
          },
        },
      );
    } catch (e) {
      setIsLoading(false);
      setVerificationSent(false);
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (!hasSentInitialRequest.current && phoneNumber) {
      hasSentInitialRequest.current = true;
      verifyAccount();
    }
  }, [verifyAccount, phoneNumber]);

  const handleToLogin = () => router.replace("/login");
  const handleRetry = () => verifyAccount();

  return (
    <AuthFormLayout>
      {isLoading ? (
        <LoadingContent title="Отправка SMS" />
      ) : error ? (
        <ErrorContent
          error={error}
          icon={<PhoneOff className="h-8 w-8 text-red-600" />}
          primaryAction={{ label: "Войти", onClick: handleToLogin }}
          secondaryAction={{
            label: "Попробовать снова",
            onClick: handleRetry,
          }}
        />
      ) : verificationSent ? (
        <EnterOTPCode phoneNumber={phoneNumber} />
      ) : null}
    </AuthFormLayout>
  );
};

export default VerifyPhonePage;
