"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { buttonStyles, formStyles } from "../../styles";

import { InputMask } from "@react-input/mask";
import { MailWarning, PhoneOff } from "lucide-react";

import Link from "next/link";
import AuthFormLayout from "../../_components/AuthFormLayout";
import LoadingContent from "../../(registration)/_components/LoadingContent";
import ErrorContent from "../../(registration)/_components/ErrorContent";
import UnverifiedEmail from "./_components/UnverifiedEmail";
import AuthMethodSelector from "./_components/AuthMethodSelector";

const EnterLoginPage = () => {
  const [login, setLogin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [showUnverifiedEmail, setShowUnverifiedEmail] = useState<boolean>(false);
  const [showAuthMethodChoice, setShowAuthMethodChoice] = useState<boolean>(false);
  const router = useRouter();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
    setError(null);
  };

  const switchToEmail = () => {
    setLogin("");
    setLoginType("email");
  };
  const switchToPhone = () => {
    setLogin("");
    setLoginType("phone");
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/auth/check-login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ login, loginType }),
      });

      const { exists, verified } = await response.json();

      if (!exists)
        setError(
          loginType === "email"
            ? "Аккаунт с таким e-mail не существует"
            : "Аккаунт с таким номером не существует",
        );

      if (!verified && loginType === "email") {
        setShowUnverifiedEmail(true);
        return;
      }

      if (!verified && loginType === "phone") {
        setError("Телефон не подтвержден. Вход возможен только по e-mail.");
        return;
      }

      if (loginType === "phone") {
        setShowAuthMethodChoice(true);
      } else {
        router.push(
          `/password-enter?login=${encodeURIComponent(login)}&loginType=${loginType}`,
        );
      }
    } catch {
      setError("Ошибка при проверке данных");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToRegister = () => router.replace("/register");

  const handleBackFromMethodChoice = () => {
    setShowAuthMethodChoice(false);
    setLogin("");
    setLoginType("phone");
  };

  const handleAuthMethodSelect = (method: "password" | "otp") => {
    const cleanLogin = login.replace(/\D/g, "");
    router.push(
      method === "password"
        ? `/password-enter?login=${encodeURIComponent(cleanLogin)}&loginType=phone`
        : `/otp-enter?login=${encodeURIComponent(cleanLogin)}&loginType=phone`,
    );
  };

  if (isLoading)
    return (
      <AuthFormLayout>
        <LoadingContent
          title={
            <span
              style={{ whiteSpace: "pre-line" }}
            >{`Проверка ${loginType === "email" ? "e-mail" : "телефона"} ${login}`}</span>
          }
        />
      </AuthFormLayout>
    );

  if (error)
    return (
      <AuthFormLayout>
        <ErrorContent
          error={error}
          title="Упс!"
          icon={
            loginType === "email" ? (
              <MailWarning className="h-8 w-8 text-red-500" />
            ) : (
              <PhoneOff className="h-8 w-8 text-red-500" />
            )
          }
          secondaryAction={{
            label: "Регистрация",
            onClick: handleToRegister,
          }}
        />
      </AuthFormLayout>
    );

  if (showUnverifiedEmail)
    return (
      <UnverifiedEmail
        email={login}
        setLoginAction={setLogin}
        setShowUnverifiedEmailAction={setShowUnverifiedEmail}
      />
    );

  if (showAuthMethodChoice)
    return (
      <AuthMethodSelector
        phoneNumber={login}
        onBackAction={handleBackFromMethodChoice}
        onMethodSelectAction={handleAuthMethodSelect}
      />
    );

  return (
    <AuthFormLayout>
      <h1 className="text-2xl font-bold text-[#414141] text-center mt-8">
        Вход
      </h1>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full mx-auto max-h-screen flex flex-col justify-center overflow-y-auto 
        gap-y-8 p-5"
      >
        <div className="w-full flex flex-wrap justify-center gap-x-8 gap-y-4 relative">
          <div className="flex flex-col gap-y-4 items-center w-full">
            <div>
              <label htmlFor="login" className={formStyles.label}>
                {loginType === "email" ? "E-mail" : "Телефон"}{" "}
              </label>
              {loginType === "phone" ? (
                <InputMask
                  mask="+7 (___) ___-__-__"
                  replacement={{ _: /\d/ }}
                  placeholder="+7 (___) ___-__-__"
                  value={login}
                  onChange={handleLoginChange}
                  className={formStyles.input}
                  required
                />
              ) : (
                <input
                  type="email"
                  value={login}
                  placeholder="example@mail.com"
                  onChange={handleLoginChange}
                  className={formStyles.input}
                  required
                />
              )}
            </div>
            <div className="w-full flex justify-evenly px-1">
              <button
                type="button"
                onClick={switchToEmail}
                className={`px-2 py-1 rounded cursor-pointer duration-300
                  ${loginType === "email" ? "bg-[#ff6633] text-white" : "bg-gray-100"}`}
              >
                По e-mail
              </button>
              <button
                type="button"
                onClick={switchToPhone}
                className={`px-2 py-1 rounded cursor-pointer duration-300
                  ${loginType === "phone" ? "bg-[#ff6633] text-white" : "bg-gray-100"}`}
              >
                По телефону
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={
            (loginType === "email" &&
              (!login.includes("@") || !login.includes("."))) ||
            (loginType === "phone" && login.replace(/\D/g, "").length < 11) ||
            isLoading
          }
          className={`${buttonStyles.base} [&&]:my-0 active:shadow-button-active duration-300 ${
            (loginType === "email" &&
              (!login.includes("@") || !login.includes("."))) ||
            (loginType === "phone" && login.replace(/\D/g, "").length < 11) ||
            isLoading
              ? "cursor-not-allowed bg-[#fcd5ba] text-[#ff6633]"
              : "bg-[#ff6633] text-white hover:shadow-article"
          }`}
        >
          Вход
        </button>
        <div className="flex flex-wrap mx-auto justify-center text-xs gap-4">
          <Link
            href="/register"
            className={`${formStyles.loginLink} w-auto px-2`}
          >
            Регистрация
          </Link>
          <Link
            href="/forgot-password"
            className="h-8 text-[#414141] hover:text-black w-30 flex items-center 
            justify-center duration-300"
          >
            Забыли пароль?
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default EnterLoginPage;
