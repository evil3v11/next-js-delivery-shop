"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SuccessModal = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen">
      <div className="bg-white rounded shadow-xl p-8 max-w-md mx-4 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Регистрации прошла успешно
        </h2>
        <p className="text-lg mb-6">
          Сейчас вы будете перенаправлены на страницу входа
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full animate-[progress_3s_linear]"
            style={{ animationFillMode: "forwards" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
