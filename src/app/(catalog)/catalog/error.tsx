"use client";

import { ErrorProps } from "@/types/errors";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

const ErrorBoundary = ({ error, reset }: ErrorProps) => {
  const router = useRouter();

  const handleRetry = () => {
    startTransition(() => {
      reset();
      router.refresh();
    });
  };

  return (
    <div className="m-4 p-4 bg-red-100 text-red-700 flex justify-center items-center">
      <p>Произошла ошибка: {error.message}</p>
      <button
        onClick={handleRetry}
        className="block px-4 py-2 rounded text-white bg-red-500 hover:bg-red-400 
      transition-colors duration-300 cursor-pointer"
      >
        Попробовать снова
      </button>
    </div>
  );
};

export default ErrorBoundary;
