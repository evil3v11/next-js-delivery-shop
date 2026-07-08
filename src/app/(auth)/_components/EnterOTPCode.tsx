"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegFormContext } from "@/app/contexts/RegFormContext";
import { useTimer } from "@/hooks/useTimer";

import { buttonStyles } from "../styles";
import { authClient } from "@/lib/auth-client";

import Link from "next/link";
import Image from "next/image";

const MAX_ATTEMPTS = 3;
const TIMEOUT_PERIOD = 180;

const EnterOTPCode = ({ phoneNumber }: { phoneNumber: string }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const { regFormData } = useRegFormContext();
  const { timeLeft, canResend, startTimer } = useTimer(TIMEOUT_PERIOD);
  const router = useRouter();

  useEffect(() => {
    startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;

    try {
      const { data: verifyData, error: verifyError } =
        await authClient.phoneNumber.verify({
          ...regFormData,
          phoneNumber,
          code,
          disableSession: false,
        });

      if (verifyError) throw verifyError;

      setAttemptsLeft(MAX_ATTEMPTS);

      const passwordResponse = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: verifyData.user.id,
          password: regFormData.password,
        }),
      });

      if (!passwordResponse.ok) {
        const errorData = await passwordResponse.json();
        console.error("Детали ошибки: ", errorData);
        throw new Error(errorData.error || "Ошибка установки пароля");
      }

      // const { error: updateError } = await authClient.updateUser(regFormData);
      // if (updateError) throw updateError;

      router.replace("/login");
    } catch (e) {
      console.error("Ошибки верификации телефона: ", e);
      setCode("");
      setAttemptsLeft((prev) => prev - 1);

      if (attemptsLeft <= 1) {
        setError("Попытки исчерпаны. Пожалуйста, зарегистрируйтесь снова.");
        setTimeout(() => router.replace("/register"), 3000);
      } else {
        setError(`Неверный код. Осталось ${attemptsLeft - 1} попыток.`);
      }
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authClient.phoneNumber.sendOtp(
        { phoneNumber },
        {
          onSuccess: () => {
            startTimer();
            setError("");
            setAttemptsLeft(MAX_ATTEMPTS);
          },
          onError: (ctx) => {
            setError(ctx.error?.message || "Ошибка при отправке SMS");
          },
        },
      );
    } catch (e) {
      console.error("Ошибка отправки кода: ", e);
      setError("Ошибка при отправке кода");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-8 p-5">
        <h1 className="text-2xl font-bold text-[#414141] text-center">
          Регистрация
        </h1>
        <div>
          <p className="text-center text-[#8f8f8f]">Код из SMS</p>
          <form
            onSubmit={handleSubmit}
            className="w-65 mx-auto max-h-screen flex flex-col justify-center items-center"
            autoComplete="off"
          >
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              autoComplete="one-time-code"
              required
              className="flex justify-center w-27.5 h-15 text-center text-2xl px-4 py-3 border 
              border-[#bfbfbf] rounded focus:border-primary focus:shadow-button-default 
              focus:bg-white focus:outline-none"
            />
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
            <button
              type="submit"
              disabled={code.length !== 4 || attemptsLeft <= 0}
              className={`${buttonStyles.base} 
              ${code.length !== 4 ? buttonStyles.inactive : buttonStyles.active} [&&]:mt-8 mb-0`}
            >
              Подтвердить
            </button>
          </form>
        </div>
        {!canResend ? (
          <p className="text-[#414141 text-xs text-center">
            Запросить код повторно можно через <span>{timeLeft} секунд</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`text-xs underline cursor-pointer text-center 
              ${canResend ? "text-[#ff6633] cursor-pointer" : "text-gray-400 cursor-not-allowed"}`}
          >
            Отправить еще раз
          </button>
        )}
        <Link
          href="/register"
          className="h-8 text-xs text-[#414141] hover:text-black w-30 flex items-center 
          justify-center gap-x-2 mx-auto duration-300 cursor-pointer"
        >
          <Image
            src="/icons-auth/icon-arrow-left.svg"
            alt="Вернуться"
            width={24}
            height={24}
            sizes="24px"
          />
          Вернуться
        </Link>
      </div>
    </>
  );
};

export default EnterOTPCode;
