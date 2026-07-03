"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { buttonStyles, formStyles } from "../../styles";

import ErrorComponent from "@/components/ErrorComponent";
import Loader from "@/components/Loader";
import PhoneInput from "../../_components/PhoneInput";
import PasswordInput from "../../_components/PasswordInput";
import Link from "next/link";
import AuthFormLayout from "../../_components/AuthFormLayout";

const initialFormData = {
  phoneNumber: "+7",
  password: "",
};

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application-json" },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber.replace(/\D/g, ""),
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Ошибка авторизации");
      router.replace("/");
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage:
          (error instanceof Error && error.message) ||
          "Ошибка авторизации, попробуйте снова",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );

  return (
    <AuthFormLayout>
      <h1 className="text-2xl font-bold text-center my-5">Вход</h1>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-[552px] mx-auto max-h-screen flex flex-col justify-center
          overflow-y-hidden"
      >
        <div className="w-full flex flex-wrap justify-center gap-x-8 gap-y-4">
          <div className="flex flex-col gap-y-4 items-start">
            <PhoneInput
              value={formData.phoneNumber}
              onChangeAction={handleChange}
            />
            <PasswordInput
              id="password"
              label="Пароль"
              value={formData.password}
              onChangeAction={handleChange}
              showPassword={showPassword}
              togglePasswordVisibilityAction={() =>
                setShowPassword(!showPassword)
              }
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!(formData.password && formData.phoneNumber) || isLoading}
          className={`${buttonStyles.base} 
            ${formData.password && formData.phoneNumber ? buttonStyles.active : buttonStyles.inactive}`}
        >
          Вход
        </button>
        <div className="flex flex-wrap gap-x-5 mx-auto text-xs">
          <Link href="/register" className={formStyles.loginLink}>
            Регистрация
          </Link>
          <Link
            href="/forgot-password"
            className="h-8 text-[#414141] hover:text-black w-30 flex justify-center
              items-center duration-300"
          >
            Забыли пароль?
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default LoginPage;
