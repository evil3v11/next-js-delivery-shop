"use client";

import { useRegFormContext } from "@/app/contexts/RegFormContext";

import { verificationButtonStyles } from "../../../styles";
import { Smartphone, Mail } from "lucide-react";

import AuthFormLayout from "../../_components/AuthFormLayout";
import Link from "next/link";

const VerificationMethodModal = () => {
  const { regFormData } = useRegFormContext();
  const { phoneNumber, email } = regFormData;
  const iconContainerStyles = `p-3 mb-4 rounded-full bg-[#fff2ed] group-hover:bg-secondary duration-300`;

  return (
    <AuthFormLayout>
      <div className="animate-in zoom-95 relative p-10">
        <div className="flex flex-col gap-y-6 items-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Подверждение аккаунта</h2>
            <p>
              Выберите удобный способ подверждения для завершения регистрации
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/verify/verify-phone"
              className={verificationButtonStyles}
            >
              <div className={iconContainerStyles}>
                <Smartphone className="h-6 w-6 text-secondary group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">
                По SMS на телефон
              </span>
              <span className="text-sm text-gray-500 mt-1">+{phoneNumber}</span>
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary opacity-75"></span>
                </span>
              </div>
            </Link>

            <div className="flex items-center my-2">
              <div className="grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-sm"></span>
              <div className="grow border-t border-gray-200"></div>
            </div>

            <Link
              href="/verify/verify-email"
              className={verificationButtonStyles}
            >
              <div className={iconContainerStyles}>
                <Mail className="h-6 w-6 text-[#ff6633 group-hover:text-white]" />
              </div>
              <span className="font-medium text-gray-900">
                По ссылке на e-mail
              </span>
              <span className="text-sm text-gray-500 mt-1">{email}</span>
            </Link>
          </div>
        </div>
      </div>
    </AuthFormLayout>
  );
};

export default VerificationMethodModal;
