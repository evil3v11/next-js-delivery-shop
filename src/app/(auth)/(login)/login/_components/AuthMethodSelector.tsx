"use client";

import { iconContainerStyles } from "@/app/(auth)/styles";
import { ArrowLeft, Key, Smartphone } from "lucide-react";
import AuthFormLayout from "@/app/(auth)/_components/AuthFormLayout";

interface AuthMethodSelectorProps {
  phoneNumber: string;
  onBackAction: () => void;
  onMethodSelectAction: (method: "password" | "otp") => void;
}

const AuthMethodSelector = ({
  phoneNumber,
  onBackAction,
  onMethodSelectAction,
}: AuthMethodSelectorProps) => {
  const buttonStyles = `
    flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200
    hover:shadow-md duration-300 cursor-pointer relative group w-full
  `;
  return (
    <AuthFormLayout>
      <div className="animate-in zoom-95 relative px-5 pt-10 pb-5">
        <div className="space-y-6 flex flex-col items-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Выберите способ входа</h2>
            <p>Для номера {phoneNumber} доступны следующие варианты:</p>
          </div>
          <div className="w-full space-y-4">
            <button
              className={buttonStyles}
              onClick={() => onMethodSelectAction("password")}
            >
              <div className={iconContainerStyles}>
                <Key className="h-6 w-6 text-[#ff6633] group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">Войти с паролем</span>
            </button>
            <button
              className={buttonStyles}
              onClick={() => onMethodSelectAction("otp")}
            >
              <div className={iconContainerStyles}>
                <Smartphone className="h-6 w-6 text-[#ff6633] group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">
                Войти по SMS-коду
              </span>
            </button>
            <button
              onClick={onBackAction}
              className="h-8 text-xs text-[#414141] hover:text-black w-30 flex items-center 
              justify-center gap-x-2 mx-auto duration-300 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium text-gray-900">Вернуться</span>
            </button>
          </div>
        </div>
      </div>
    </AuthFormLayout>
  );
};

export default AuthMethodSelector;
