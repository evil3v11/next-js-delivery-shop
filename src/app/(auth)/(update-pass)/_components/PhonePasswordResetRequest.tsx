"use client";

import { useState } from "react";
import AuthFormLayout from "../../_components/AuthFormLayout";
import { KeyRound, Loader2, Phone } from "lucide-react";
import { buttonStyles, formStyles } from "../../styles";
import { InputMask } from "@react-input/mask";
import { authClient } from "@/lib/auth-client";

interface PhonePasswordResetRequestProps {
  onSuccessAction: (phoneNumber: string) => void;
  isLoading: boolean;
  setLoadingAction: (isLoading: boolean) => void;
  error: string | null;
  setErrorAction: (error: string | null) => void;
}

const PhonePasswordResetRequest = ({
  onSuccessAction,
  isLoading,
  setLoadingAction,
  error,
  setErrorAction,
}: PhonePasswordResetRequestProps) => {
  const [phone, setPhone] = useState("");

  const handleRequestSend = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setLoadingAction(true);
      setErrorAction(null);
      if (!phone) {
        setErrorAction("Введите телефон");
        return;
      }

      const { error: phoneResetError } =
        await authClient.phoneNumber.requestPasswordReset({
          phoneNumber: phone.replace(/\D/g, ""),
        });

      if (phoneResetError) {
        if (
          phoneResetError.message?.toLowerCase().includes("isn't registered")
        ) {
          throw new Error("Номер телефона не зарегестрирован в системе");
        }

        throw new Error(phoneResetError.message || "Не удалось отправить код");
      }

      onSuccessAction(phone);
    } catch (e) {
      setErrorAction(e instanceof Error ? e.message : "Произшла ошибка");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-5 p-10">
        <div className="flex flex-col items-center">
          <KeyRound className="w-12 h-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold ">
            Сброс пароля через SMS
          </h1>
        </div>
        <p className="text-center">Введите номер телефона, на который придет код для сброса пароля</p>
        {error && (
          <div className="p-3 bg-red-100 text-red-500 rounded text-sm">
            {error}
          </div>
        )}
        <form
          onSubmit={handleRequestSend}
          className="flex flex-col gap-y-4 mx-auto"
        >
          <div>
            <label htmlFor="phone" className={formStyles.label}>
              Номер телефона
            </label>
            <InputMask
              mask="+7 (___) ___-__-__"
              placeholder="+7 (___) ___-__-__"
              replacement={{ _: /\d/ }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={formStyles.input}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`${buttonStyles.active} rounded [&&]:w-full [&&]:h-10 cursor-pointer flex 
            items-center justify-center gap-2 ${isLoading ? "bg-[#fcd5ba]" : ""}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Отправка...
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                Отправить код
              </>
            )}
          </button>
        </form>
      </div>
    </AuthFormLayout>
  );
};

export default PhonePasswordResetRequest;
