"use client";

import Link from "next/link";
import { buttonStyles, formStyles } from "../styles";

const RegFormFooter = ({
  isFormValid,
  isLoading,
}: {
  isFormValid: boolean;
  isLoading: boolean;
}) => {
  return (
    <div className="flex flex-col justify-center">
      <button
        type="submit"
        disabled={isLoading}
        className={`${buttonStyles.base} ${isFormValid ? buttonStyles.active : buttonStyles.inactive}`}
      >
        Продолжить
      </button>
      <Link href="/login" className={formStyles.loginLink}>
        Вход
      </Link>
    </div>
  );
};

export default RegFormFooter;
