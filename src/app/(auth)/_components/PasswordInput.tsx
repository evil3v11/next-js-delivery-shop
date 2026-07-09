"use client";

import IconVision from "@/components/svg/IconVision";

import { formStyles } from "../styles";
import Tooltip from "./Tooltip";
import { isPasswordValid } from "@/utils/validation/isPasswordValid";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  togglePasswordVisibilityAction: () => void;
  showRequirements?: boolean;
  compareWith?: string;
  inputClass?: string;
}

const PasswordInput = ({
  id,
  label,
  value,
  onChangeAction,
  showPassword,
  togglePasswordVisibilityAction,
  showRequirements,
  compareWith,
  inputClass = "",
}: PasswordInputProps) => {

  const shouldShowTooltip = () => {
    if (showRequirements) return value.length > 0 && !isPasswordValid(value);

    if (compareWith)
      return (
        value.length > 0 && compareWith.length > 0 && value !== compareWith
      );

    return false;
  };

  const getTooltipText = () => {
    if (showRequirements) {
      return "Пароль должен быть иметь 5+ буквы и цифр, и включать хотя бы одну заглавную букву";
    }
    return "Пароли не совпадают";
  };

  return (
    <div>
      <label htmlFor={id} className={formStyles.label}>
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChangeAction}
          className={`${formStyles.input} ${inputClass}`}
          autoComplete="off"
          readOnly
          onFocus={(e) => e.target.removeAttribute("readonly")}
        />
        <button
          type="button"
          onClick={togglePasswordVisibilityAction}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        >
          <IconVision showPassword={showPassword} />
        </button>
        {shouldShowTooltip() && <Tooltip text={getTooltipText()} />}
      </div>
    </div>
  );
};

export default PasswordInput;
