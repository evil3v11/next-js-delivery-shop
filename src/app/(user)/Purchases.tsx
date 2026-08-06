"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { ProductCardProps } from "@/types/product";

import { CONFIG } from "../../../config/config";
import fetchPurchases from "./fetchPurchases";

import ProductsSection from "../(products)/ProductsSection";
import ErrorComponent from "@/components/ErrorComponent";
import Loader from "@/components/Loader";

const Purchases = () => {
  const { user, isAuth } = useAuthStore();
  const [items, setItems] = useState<ProductCardProps[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPurchases, setShowPurchases] = useState<boolean>(false);

  useEffect(() => {
    const checkAccessAndFetchData = async () => {
      try {
        const hasAccess = isAuth && user?.role === "user";
        setShowPurchases(hasAccess);

        if (hasAccess) {
          const { products } = await fetchPurchases({
            userPurchasesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
            userId: user.id
          });
          setItems(products);
        }
      } catch (e) {
        setError(
          e instanceof Error ? e : new Error("Ошибка при загрузке покупок"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkAccessAndFetchData();
  }, [isAuth, user]);

  if (error) return <ErrorComponent error={error} userMessage="Не удалось загрузить ваши покупки" />;
  if (isLoading) return <Loader />;

  return (
    showPurchases && (
      <ProductsSection
        title="Покупали раньше"
        viewAllBtn={{ text: "К покупкам", href: "/purchases" }}
        products={items}
      />
    )
  );
};

export default Purchases;
