"use client";

import { useState } from "react";
import PhonePasswordResetRequest from "../../_components/PhonePasswordResetRequest";
import PhonePasswordResetVerify from "../../_components/PhonePasswordResetVerify";

const PhonePasswordResetPage = () => {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestSuccess = (phoneNumber: string): void => {
    setStep("verify");
    setPhone(phoneNumber);
  };

  const handleBack = () => {
    setStep("request");
    setError(null);
  };

  if (step === "verify") {
    return (
      <PhonePasswordResetVerify
        phone={phone}
        isLoading={isLoading}
        setLoadingAction={setIsLoading}
        error={error}
        setErrorAction={setError}
        onBackAction={handleBack}
      />
    );
  }

  return (
    <PhonePasswordResetRequest
      onSuccessAction={handleRequestSuccess}
      isLoading={isLoading}
      setLoadingAction={setIsLoading}
      error={error}
      setErrorAction={setError}
    />
  );
};

export default PhonePasswordResetPage;
