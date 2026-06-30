"use client";

import { ErrorComponentProps } from "@/types/errors";

const ErrorComponent = ({ error, userMessage }: ErrorComponentProps) => {
  console.error("Произшла ошибка:\n", error);
  return (
    <div className="mt-4 p-4 bg-red-100 text-red-800 rounded text-center">
      <p>{userMessage || "Произшла ошибка. Пожалуйста, попробуйте позже."}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt px-3 py-1 bg-red-500 hover:bg-red-400 transition-colors duration-300 
          rounded cursor-pointer"
      >
        Попробовать снова
      </button>
    </div>
  );
};

export default ErrorComponent;
