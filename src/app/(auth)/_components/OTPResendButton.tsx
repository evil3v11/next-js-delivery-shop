"use client";

interface OTPResendButtonProps {
  canResend: boolean;
  onResendAction: () => void;
  timeLeft: number;
}

const OTPResendButton = ({
  canResend,
  onResendAction,
  timeLeft,
}: OTPResendButtonProps) => {
  return !canResend ? (
    <p className="text-[#414141] text-xs text-center">
      Запросить код повторно можно через <span>{timeLeft} секунд</span>
    </p>
  ) : (
    <button
      onClick={onResendAction}
      disabled={!canResend}
      className={`text-xs underline cursor-pointer text-center ${canResend ? "text-[#ff6633] cursor-pointer" : "text-gray-400 cursor-not-allowed"}`}
    >
      Отправить еще раз
    </button>
  );
};

export default OTPResendButton;
