"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTimer } from "@/hooks/useTimer";

import { authClient } from "@/lib/auth-client";
import { CONFIG } from "../../../../../config/config";

import AlertMessage from "../AlertMessage";
import PhoneVerifyView from "./PhoneVerifyView";
import EditButton from "./EditButton";
import PhoneEditView from "./PhoneEditView";
import UserProfilePhoneInput from "./UserProfilePhoneInput";

const ProfilePhoneSettings = () => {
  const { user, fetchUserData } = useAuthStore();
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<"edit" | "verify">(
    "edit",
  );
  const [otpCode, setOtpCode] = useState<string>("");
  const [attemptsLeft, setAttetmptsLeft] = useState<number>(
    CONFIG.MAX_ATTEMPTS,
  );
  const { timeLeft, canResend, startTimer } = useTimer(CONFIG.TIMEOUT_PERIOD);

  const isPhoneRegistered = user?.phoneNumberVerified === true;
  const currentPhone = user?.phoneNumber || "";

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewPhoneNumber(currentPhone);
    }
  }, [user, currentPhone]);

  const handleNewPhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPhoneNumber(e.target.value.replace(/\D/g, ""));
    setError("");
  };

  const handleCancel = () => {
    setNewPhoneNumber(currentPhone);
    setIsEditing(false);
    setError("");
    setVerificationStep("edit");
    setOtpCode("");
    setAttetmptsLeft(CONFIG.MAX_ATTEMPTS);
  };

  const handleSave = async () => {
    if (!user) return;

    const currentlyDisplayedPhoneNumber = user.phoneNumber || "";
    if (newPhoneNumber === currentlyDisplayedPhoneNumber) {
      setError("Новый номер телефона совпадает с текущим");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      if (!isPhoneRegistered) {
        await updatePhoneNumberDirectly();
      } else {
        await sendVerificationCode();
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Не удалось обновить номер телефона",
      );
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  async function updatePhoneNumberDirectly() {
    if (user) {
      const response = await fetch("/api/users/update-phone", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          phoneNumber: newPhoneNumber.replace(/\D/g, ""),
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      await fetchUserData();
    }
  }

  async function sendVerificationCode() {
    try {
      setIsSendingOtp(true);
      setError("");
      await authClient.phoneNumber.sendOtp(
        { phoneNumber: currentPhone },
        {
          onSuccess: () => {
            setIsSendingOtp(false);
            setVerificationStep("verify");
            startTimer();
          },
          onError: (ctx) => {
            setIsSendingOtp(false);
            setError(ctx?.error.message || "Ошибка при отправке SMS");
          },
        },
      );
    } catch (e) {
      setIsSendingOtp(false);
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      return false;
    }
  }

  const verifyOtpAndUpdatePhone = async () => {
    if (otpCode.length !== 4) return;

    try {
      setIsLoading(true);
      setError("");

      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber: currentPhone,
        code: otpCode,
      });

      if (verifyError) throw verifyError;

      await updatePhoneNumberDirectly();
      setVerificationStep("edit");
      setOtpCode("");
      setAttetmptsLeft(CONFIG.MAX_ATTEMPTS);
    } catch (e) {
      handleVerificationError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationError = (errorMessage: string) => {
    console.error("Ошибка верификации: ", errorMessage);
    setOtpCode("");
    setAttetmptsLeft((prev) => prev - 1);
    if (attemptsLeft <= 1) {
      setError("Попытки исчерпаны. Попробуйте еще раз.");
      setTimeout(() => handleCancel(), 2000);
    } else {
      setError(`Неверный код. Осталось попыток ${attemptsLeft - 1}`);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    await sendVerificationCode();
  };

  return (
    <div className="flex flex-col gap-y-5 w-full relative">
      <h2 className="text-xl font-bold text-[#414141]">Телефон</h2>
      <UserProfilePhoneInput
        value={newPhoneNumber}
        onChangeAction={handleNewPhoneNumberChange}
        disabled={!isEditing || verificationStep === "verify"}
      />
      <div className="md:absolute right-0 top-0">
        {verificationStep === "edit" && !isEditing ? (
          <EditButton setEditAction={() => setIsEditing(true)} />
        ) : verificationStep === "edit" && isEditing ? (
          <PhoneEditView
            isLoading={isLoading}
            onSaveAction={handleSave}
            onCancelAction={handleCancel}
            isSendingOtp={isSendingOtp}
          />
        ) : verificationStep === "verify" ? (
          <PhoneEditView
            isLoading={isLoading}
            onCancelAction={handleCancel}
            isSendingOtp={isSendingOtp}
            isVerificationMode={true}
          />
        ) : null}
      </div>
      {isEditing && !isPhoneRegistered && (
        <AlertMessage
          type="success"
          message="Вы можете изменить номер телефона без подтверждения, т.к. были зарегестрированы по email."
        />
      )}
      {isEditing && isPhoneRegistered && (
        <AlertMessage
          type="warning"
          message="Для смены номера телефона потребуется подтверждение через код SMS."
        />
      )}
      {error && <AlertMessage type="error" message={error} />}
      {verificationStep === "verify" && (
        <PhoneVerifyView
          currentPhone={currentPhone}
          code={otpCode}
          isLoading={isLoading}
          onCodeChange={(code) => {
            setOtpCode(code.replace(/\D/g, ""));
            setError("");
          }}
          onVerify={verifyOtpAndUpdatePhone}
          timeLeft={timeLeft}
          canResend={canResend}
          onResendCode={handleResendCode}
        />
      )}
    </div>
  );
};

export default ProfilePhoneSettings;
