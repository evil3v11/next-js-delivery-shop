"use client";

import { useMemo } from "react";

import { formStyles } from "@/app/(auth)/styles";

import { InputMask } from "@react-input/mask";
import { Phone } from "lucide-react";

interface UserProfilePhoneInputProps {
  value: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const UserProfilePhoneInput = ({
  value,
  onChangeAction,
  disabled,
}: UserProfilePhoneInputProps) => {
  const maskValue = useMemo(() => {
    if (!value) return "";
    const cleanValue = value.replace(/\D/g, "");
    let formatted = "+7";

    if (cleanValue.length > 1) formatted += ` (${cleanValue.slice(1, 4)}`;
    if (cleanValue.length > 4) formatted += `) ${cleanValue.slice(4, 7)}`;
    if (cleanValue.length > 7) formatted += `-${cleanValue.slice(7, 9)}`;
    if (cleanValue.length > 9) formatted += `-${cleanValue.slice(9, 11)}`;

    return formatted;
  }, [value]);

  return (
    <div className="relative">
      <InputMask
        mask="+7 (___) ___-__-__"
        replacement={{ _: /\d/ }}
        placeholder="+7 (___) ___-__-__"
        value={maskValue}
        onChange={onChangeAction}
        disabled={disabled}
        className={`${formStyles.input} w-full disabled:cursor-not-allowed disabled:bg-[#f3f2f1] mt-5`}
      />
      <Phone className="absolute right-3 top-1/2 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default UserProfilePhoneInput;
