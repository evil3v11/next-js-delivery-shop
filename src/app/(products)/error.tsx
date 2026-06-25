"use client";

import { ErrorProps } from "@/types/errors";

const ErrorBoundary = ({ error, reset }: ErrorProps) => {
  return (
    <div className="p-4 space-y-4 text-red-500">
      <h2>Ошибка получения продуктов</h2>
      <p className="text-sm">{error.message || "Unexpected error"}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-indigo-500 text-white rounded"
      >
        Click to load again
      </button>
    </div>
  );
};

export default ErrorBoundary;
