"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export const useFavorite = () => {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadFavorites = async (): Promise<void> => {
      if (!user?.id) {
        setFavorites([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/favorites?userId=${user.id}`);
        if (!response.ok) throw new Error("Ошибка при запросе избранных товаров");
        const { favorites } = await response.json();
        setFavorites(favorites || []);
      } catch (e) {
        console.error("Не удалось получить избранные товары: ", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user?.id]);

  const isFavorite = (productId: string): boolean => favorites.includes(productId);

  const toggleFavorite = async (productId: string): Promise<void> => {
    if (!productId || !user?.id) return;

    const productIsInFavorites = isFavorite(productId);
    const action = productIsInFavorites ? "remove" : "add";

    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/favorites`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, userId: user.id, action }),
      });

      if (!response.ok) throw new Error("Ошибка при добавлении/удалении товара из Избранных");

      if (productIsInFavorites) {
        setFavorites((prev) => prev.filter((favId) => favId !== productId));
      } else {
        setFavorites((prev) => [...prev, productId]);
      }
    } catch (e) {
      console.error("Не удалось добавить/удалить товар из Избранных: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorite, isLoading, toggleFavorite };
};
