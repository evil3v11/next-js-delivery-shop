"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";

import { buttonStyles } from "../../../styles";

import AuthFormLayout from "../../_components/AuthFormLayout";
import LoadingContent from "../../(registration)/_components/LoadingContent";
import PasswordInput from "../../_components/PasswordInput";
import Tooltip from "../../../../components/Tooltip";
import Image from "next/image";

const EnterPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <AuthFormLayout>
          <LoadingContent title="Сейчас запросим пароль" />
        </AuthFormLayout>
      }
    >
      <EnterPasswordContent />
    </Suspense>
  );
};

const EnterPasswordContent = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const { login } = useAuthStore();

  const searchParams = useSearchParams();
  const loginParam = searchParams.get("login") || "";
  const loginType = searchParams.get("loginType") || "";

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message.includes("Неверный пароль") ||
        error.message.includes("Invalid email or password")
        ? "Неверный пароль"
        : error.message;
    }

    return "Произошла непредвиденная ошибка";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleForgotPassword = () => {
    if (loginType === "phone") {
      router.replace("/phone-pass-reset");
    } else {
      router.replace("/forgot-password");
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      if (loginType === "phone") {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ phoneNumber: loginParam, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Ошибка при входе");
        login();

        router.replace("/");
      } else {
        await authClient.signIn.email(
          {
            email: loginParam,
            password,
          },
          {
            onSuccess: () => {
              login();
              router.replace("/");
            },
            onError: (ctx) => {
              if (ctx.error.message.includes("Invalid email or password")) {
                setError("Неверный пароль");
              } else {
                setError(ctx.error.message || "Ошибка при входе");
              }
            },
          },
        );
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <AuthFormLayout>
        <LoadingContent title={"Происходит авторизация"} />
      </AuthFormLayout>
    );

  return (
    <AuthFormLayout>
      <h1 className="text-2xl font-bold text-main-text text-center mt-8">
        Вход
      </h1>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full mx-auto max-h-screen flex flex-col justify-center gap-y-8 py-10"
      >
        <div className="w-full flex flex-wrap justify-center gap-x-8 gap-y-4 relative">
          <div className="flex flex-col gap-y-4 items-center w-full">
            <PasswordInput
              id="password"
              label="Пароль"
              value={password}
              onChangeAction={handleChange}
              showPassword={showPassword}
              togglePasswordVisibilityAction={() =>
                setShowPassword(!showPassword)
              }
              inputClass="h-15"
            />
            {error && <Tooltip text={error} position="top" />}
          </div>
        </div>
        <button
          type="submit"
          disabled={!password || isLoading}
          className={`${buttonStyles.base} [&&]:my-0 my-8
          ${!password || isLoading ? buttonStyles.inactive : buttonStyles.active}`}
        >
          Подтвердить
        </button>
        <div className="flex flex-wrap mx-auto justify-center text-xs gap-4">
          <button
            onClick={() => router.replace("/login")}
            className="h-8 text-main-text hover:text-black w-30 flex items-center justify-center 
            gap-x-2 duration-300 cursor-pointer"
          >
            <Image
              src="/icons-auth/icon-arrow-left.svg"
              alt="Вернуться"
              height={24}
              width={24}
              sizes="24px"
            />
            Вернуться
          </button>
          <button
            onClick={handleForgotPassword}
            className="h-8 text-main-text hover:text-black w-30 flex items-center 
            justify-center duration-300"
          >
            Забыли пароль?
          </button>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default EnterPasswordPage;
