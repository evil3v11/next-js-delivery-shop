"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useFavorite } from "@/hooks/useFavorite";

import IconHeart from "./svg/IconHeart";

const AddToFavoritesButton = ({
  productId,
  variant,
}: {
  productId: string;
  variant?: string;
}) => {
  const { isAuth } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { isFavorite, isLoading, toggleFavorite } = useFavorite();
  const router = useRouter();

  const isActive = isAuth && isFavorite(productId);
  const onProductPage = variant === "onProductPage";

  const handleClick = async () => {
    if (!isAuth) {
      router.push("/login");
      return;
    }

    try {
      setIsProcessing(true);
      await toggleFavorite(productId);
    } catch (e) {
      console.error("Не удалось добавить товар в Избранное: ", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      title={isActive ? "Удалить из избранного" : "Добавить в избранное"}
      onClick={handleClick}
      disabled={isProcessing || isLoading}
      className={`w-8 h-8 top-2 right-2 rounded cursor-pointer duration-300 z-10 flex items-center
      ${
        onProductPage
          ? "static w-auto gap-x-2 text-sm text-main-text bg-[#fbf8ec] hover:opacity-80"
          : "absolute justify-center p-2 bg-[#f3f2f1] hover:bg-[#fcd5ba] opacity-50"
      }`}
    >
      <IconHeart isActive={isActive} />
      {onProductPage ? "Добавить в избранное" : ""}
    </button>
  );
};

export default AddToFavoritesButton;
