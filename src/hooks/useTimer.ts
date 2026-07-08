import { useEffect, useState } from "react";

export const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    if (!isTimerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          return 0;
        } else return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive]);

  const startTimer = () => {
    setTimeLeft(initialTime);
    setIsTimerActive(true);
  };

  return { timeLeft, canResend: !isTimerActive, startTimer };
};
