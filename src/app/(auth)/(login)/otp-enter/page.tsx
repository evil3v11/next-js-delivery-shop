"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { PhoneOff } from "lucide-react";
import AuthFormLayout from "../../_components/AuthFormLayout";
import LoadingContent from "../../(registration)/_components/LoadingContent";
import ErrorContent from "../../(registration)/_components/ErrorContent";
import LoginWithOTP from "../login/_components/LoginWithOTP";

const EnterOTPPage = () => {
  return (
    <Suspense fallback={<LoadingContent title="Запрашиваем код" />}>
      <EnterOTPContent />
    </Suspense>
  );
};

const EnterOTPContent = () => {
  const [status, setStatus] = useState<"sending" | "sent" | "error">("sending");
  const [error, setError] = useState("");
  const isSentRef = useRef(false);

  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("login") || "";

  useEffect(() => {
    const sendOTP = async () => {
      if (isSentRef.current || !phoneNumber) return;

      isSentRef.current = true;
      try {
        await authClient.phoneNumber.sendOtp(
          { phoneNumber },
          {
            onSuccess: () => {
              setStatus("sent");
            },
            onError: (ctx) => {
              setStatus("error");
              setError(ctx.error.message || "Ошибка при отправке SMS");
              isSentRef.current = false;
            },
          },
        );
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Неизвестная ошибка");
        isSentRef.current = false;
      }
    };

    sendOTP();
  }, [phoneNumber]);

  const handleRetry = () => {
    setStatus("sending");
    setError("");
    isSentRef.current = false;
  };

  if (status === "sending")
    return (
      <AuthFormLayout>
        <LoadingContent title={`Отправка SMS на номер +${phoneNumber}`} />
      </AuthFormLayout>
    );

  if (status === "error")
    return (
      <AuthFormLayout>
        <ErrorContent
          error={error}
          icon={<PhoneOff className="h-8 w-8 text-red-600" />}
          primaryAction={{
            label: "Попробовать снова",
            onClick: handleRetry,
          }}
        />
      </AuthFormLayout>
    );

  return <LoginWithOTP phoneNumber={phoneNumber} />;
};

export default EnterOTPPage;
