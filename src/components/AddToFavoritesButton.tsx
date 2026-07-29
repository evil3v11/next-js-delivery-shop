"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useFavorite } from "@/hooks/useFavorite";

import IconHeart from "./svg/IconHeart";

const AddToFavoritesButton = ({ productId }: { productId: string }) => {
  const { isAuth, user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { isFavorite, isLoading, toggleFavorite } = useFavorite();
  const router = useRouter();

  const isActive = isAuth && isFavorite(productId);

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
      title={isActive ? "Удалить из Избранного" : "Добавить в Избранные"}
      onClick={handleClick}
      disabled={isProcessing || isLoading}
      className="w-8 h-8 p-2 bg-[#f3f2f1] hover:bg-[#fcd5ba] absolute top-2 right-2 opacity-50 rounded 
      cursor-pointer duration-300 z-10 flex items-center justify-center"
    >
      <IconHeart isActive={isActive} />
    </button>
  );
};

export default AddToFavoritesButton;
