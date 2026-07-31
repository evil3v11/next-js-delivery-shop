"use client";

import { useRouter } from "next/navigation";
import { useRegFormContext } from "@/app/contexts/RegFormContext";

import { buttonStyles } from "../../../styles";
import { MailCheck } from "lucide-react";

const SuccessSent = () => {
  const { regFormData } = useRegFormContext();
  const router = useRouter();
  return (
    <div className="space-y-6 flex flex-col items-center p-5">
      <div className="flex flex-col items-center text-center gap-y-4">
        <div className="p-3 bg-primary rounded-full">
          <MailCheck className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Письмо отправлено!
          </h2>
          <p className="text-gray-600 max-w-md">
            Мы отправили e-mail с подверждением на{" "}
            <span className="font-semibold text-secondary">
              {regFormData.email}
            </span>
            . Пожалуйста, проверьте и следуйте инструкциям.
          </p>
        </div>
      </div>

      <div>
        <button
          onClick={() => router.replace("/login")}
          className={`${buttonStyles.active} px-4 py-2 rounded cursor-pointer bg-primary 
          hover:bg-primary/80 duration-300 transition-colors`}
        >
          Перейти к авторизации
        </button>
      </div>
    </div>
  );
};

export default SuccessSent;
